'use strict';
(function () {
  var defaultUrl = 'https://raw.github.com/sprintly/sprint.ly-culture/master/pr-template.md';

  // Saves options to chrome.storage
  function save_options() {

    var githubEnabled = document.getElementById('githubEnabled').checked;
    var githubTemplateUrl = document.getElementById('githubTemplateUrl').value;
    var githubTemplateContent = document.getElementById('githubTemplateContent').value;
    var bitbucketEnabled = document.getElementById('bitbucketEnabled').checked;
    var bitbucketTemplateContent = document.getElementById('bitbucketTemplateContent').value
    var bitbucketTemplateUrl = document.getElementById('bitbucketTemplateUrl').value;
    var bitbucketOverwrite = document.getElementById('bitbucketOverwrite').checked;

    var customEnabled = document.getElementById('customRepoEnabled').checked;
    var customTemplateContent = document.getElementById('customRepoTemplateContent').value;
    var customTemplateUrl = document.getElementById('customRepoTemplateUrl').value;
    var customRepoRegex = document.getElementById('customRepoRegex').value;
    var customRepoDescriptionID = document.getElementById('customRepoDescriptionID').value;

    chrome.storage.sync.set({
      githubEnabled: githubEnabled,
      githubTemplateUrl: githubTemplateUrl ? githubTemplateUrl : defaultUrl,
      githubTemplateContent: githubTemplateContent || '',
      bitbucketEnabled: bitbucketEnabled,
      bitbucketTemplateUrl: bitbucketTemplateUrl ? bitbucketTemplateUrl : defaultUrl,
      bitbucketTemplateContent: bitbucketTemplateContent || '',
      customEnabled: customEnabled,
      customTemplateUrl: customTemplateUrl ? customTemplateUrl : defaultUrl,
      customTemplateContent: customTemplateContent || '',
      customRepoRegex: customRepoRegex ? customRepoRegex : '',
      customRepoDescriptionID: customRepoDescriptionID ? customRepoDescriptionID : '',
      bitbucketOverwrite: bitbucketOverwrite

    }, function () {
      // Update status to let user know options were saved.
      var result = document.getElementById('save-result');
      result.className = result.className.replace(/\bhide\b/,'');

      setTimeout(function () {
        result.className = result.className + ' hide';
      }, 1500);
    });

  }

  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {

    chrome.storage.sync.get({
      githubEnabled: true,
      githubTemplateUrl: defaultUrl,
      githubTemplateContent: '',
      bitbucketEnabled: true,
      bitbucketTemplateUrl: defaultUrl,
      bitbucketTemplateContent: '',
      bitbucketOverwrite: true,

      customEnabled: true,
      customTemplateUrl: defaultUrl,
      customTemplateContent: '',
      customRepoRegex: '',
      customRepoDescriptionID: ''

    }, function (items) {
      document.getElementById('githubEnabled').checked = items.githubEnabled;
      document.getElementById('githubTemplateUrl').value = items.githubTemplateUrl;
      document.getElementById('githubTemplateContent').value = items.githubTemplateContent;
      document.getElementById('bitbucketEnabled').checked = items.bitbucketEnabled;
      document.getElementById('bitbucketTemplateUrl').value = items.bitbucketTemplateUrl;
      document.getElementById('bitbucketTemplateContent').value = items.bitbucketTemplateContent;
      document.getElementById('bitbucketOverwrite').checked = items.bitbucketOverwrite;

      document.getElementById('customRepoEnabled').checked = items.customEnabled;
      document.getElementById('customRepoTemplateUrl').value = items.customTemplateUrl;
      document.getElementById('customRepoTemplateContent').value = items.customTemplateContent;
      document.getElementById('customRepoRegex').value = items.customRepoRegex;
      document.getElementById('customRepoDescriptionID').value = items.customRepoDescriptionID;

    });

  }

  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save_options);
})();
