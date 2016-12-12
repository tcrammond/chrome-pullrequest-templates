'use strict';
(function () {
  var defaultUrl = 'https://raw.github.com/sprintly/sprint.ly-culture/master/pr-template.md';
  var options, isCustom;

  var isGH = window.location.href.match(/github.com/);
  var isBB = window.location.href.match(/bitbucket.org/);

  loadOptions(getTemplate);

  function loadOptions (cb) {
    chrome.storage.sync.get({
      githubEnabled: true,
      githubTemplateUrl: defaultUrl,
      githubTemplateContent: '',
      bitbucketEnabled: true,
      bitbucketTemplateUrl: defaultUrl,
      bitbucketTemplateContent: '',

      customEnabled: true,
      customTemplateUrl: defaultUrl,
      customRepoRegex: '',
      customRepoDescriptionID: ''
    }, function (items) {
      options = items;
      cb();
    });
  }

  function insertTemplate (template) {
    var el = null;

    if (isGH && options.githubEnabled) {
      el = document.getElementById('pull_request_body');
    } else if (isBB && options.bitbucketEnabled) {
      el = document.getElementById('id_description');
    } else if(isCustom && options.customEnabled && options.customRepoDescriptionID) {
      el = document.getElementById(options.customRepoDescriptionID.toString());
    }

    if (el !== null) {
      /*
       Bitbucket clears out the PR description field / put in its own content based on commits to be merged.
       We'll append the content.
      */
      if (isBB || isCustom) {
        setTimeout(function() {
          el.value = el.value + (el.value && el.value.length ? '\r\n' : '') + template;
        }, 1000);
      } else {
        el.value = template;
      }
    }
  }

  function getTemplate() {
    var templateToLoad;
    var xhr = new XMLHttpRequest();

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
      xhr.open("GET", (templateToLoad), true);
      xhr.send();
    }

  }
})();
