'use strict';
const browser = require('webextension-polyfill');
const marked = require('marked');

(function () {
  const defaultUrl = 'https://raw.github.com/sprintly/sprint.ly-culture/master/pr-template.md';
  let options;
  let isCustom;

  const isGH = window.location.href.match(/github.com/);
  const isBB = window.location.href.match(/bitbucket.org/);

  loadOptions(getTemplate);

  function loadOptions (cb) {
    browser.storage.sync
      .get({
        githubEnabled: true,
        githubTemplateUrl: defaultUrl,
        githubTemplateContent: '',
        bitbucketEnabled: true,
        bitbucketTemplateUrl: defaultUrl,
        bitbucketTemplateContent: '',
        bitbucketOverwrite: true,

        customEnabled: true,
        customTemplateUrl: defaultUrl,
        customRepoRegex: '',
        customRepoDescriptionID: ''
      }).then((items) => {
        options = items;
        cb();
      }).catch((e) => {
        console.error('Could not fecth options.', e);
      });
  }

  function insertTemplate (template) {
    let el = null;
    let isBitbucketProseEditor = false;

    if (isGH && options.githubEnabled) {
      el = document.getElementById('pull_request_body');
    } else if (isBB && options.bitbucketEnabled) {
      // If this looks like an "Edit PR" page, do not insert the template.
      if (window.location.href.indexOf('/update') !== -1) return;

      // Check for new beta editor, falling back to default
      const test = document.getElementById('ak_editor_description');
      isBitbucketProseEditor = !!test;

      // Deal with bitbucket immediately since it's getting a bit bespoke now.
      // One day, we'll re-write this whole thing..
      if (isBitbucketProseEditor) {
        setTimeout(function () {
          el = document.getElementsByClassName('ProseMirror')[0];
          insertContenteditable(el, template, options.bitbucketOverwrite);
        }, 2500);
        return;
      } else {
        el = document.getElementById('id_description');
        insertInput(el, template, options.bitbucketOverwrite);
      }
    } else if (isCustom && options.customEnabled && options.customRepoDescriptionID) {
      el = document.getElementById(options.customRepoDescriptionID.toString());
    }

    if (el === null) return;

    if (isGH) { return insertInput(el, template, true); }

    // If this looks like an "Edit PR" page, do not insert the template.
    if (window.location.href.indexOf('/update') !== -1) return;

    if (isCustom) { insertInput(el, template, options.bitbucketOverwrite); }
  }

  // Old textarea editor
  function insertInput (el, template, overwrite) {
    if (overwrite) {
      el.value = template;
    } else {
      setTimeout(function () {
        el.value = el.value + ((el.value && el.value.length ? '\r\n' : '') + template);
      }, 1000);
    }
  }

  // New contenteditable editor
  function insertContenteditable (el, template, overwrite) {
    setTimeout(function () {
      if (overwrite) {
        el.innerHTML = marked(template, { sanitize: true });
      } else {
        const hasContent = el.innerHTML && el.innerHTML.length;
        el.innerHTML = `${el.innerHTML}${hasContent ? '<br/>' : ''}${marked(template, { sanitize: true })}`;
      }
    }, 1000);
  }

  function getTemplate () {
    let templateToLoad;
    const xhr = new XMLHttpRequest();

    isCustom = (options.customRepoRegex) ? new RegExp(options.customRepoRegex).test(window.location.href) : false;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        insertTemplate(xhr.responseText);
      }
    };

    if (isGH) {
      // GitHub cannot retrieve from external URL due to cross origin rules.
      insertTemplate(options.githubTemplateContent);
    } else if (isBB) {
      if (options.bitbucketTemplateContent) return insertTemplate(options.bitbucketTemplateContent);
      templateToLoad = options.bitbucketTemplateUrl;
    } else if (isCustom) {
      if (options.customTemplateContent) return insertTemplate(options.customTemplateContent);
      templateToLoad = options.customTemplateUrl;
    }

    if (templateToLoad) {
      xhr.open('GET', (templateToLoad), true);
      xhr.send();
    }
  }
})();
