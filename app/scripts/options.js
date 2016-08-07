'use strict';
(function () {
    var defaultUrl = 'https://raw.github.com/sprintly/sprint.ly-culture/master/pr-template.md';

    // Saves options to chrome.storage
    function save_options() {

        var githubEnabled = document.getElementById('githubEnabled').checked;
        var githubTemplateUrl = document.getElementById('githubTemplateUrl').value;
        var bitbucketEnabled = document.getElementById('bitbucketEnabled').checked;
        var bitbucketTemplateUrl = document.getElementById('bitbucketTemplateUrl').value;
        
        var customEnabled = document.getElementById('customRepoEnabled').checked;
        var customTemplateUrl = document.getElementById('customRepoTemplateUrl').value;
        var customRepoRegex = document.getElementById('customRepoRegex').value;
        var customRepoDescriptionID = document.getElementById('customRepoDescriptionID').value;

        chrome.storage.sync.set({
            githubEnabled: githubEnabled,
            githubTemplateUrl: githubTemplateUrl ? githubTemplateUrl : defaultUrl,
            bitbucketEnabled: bitbucketEnabled,
            bitbucketTemplateUrl: bitbucketTemplateUrl ? bitbucketTemplateUrl : defaultUrl,

            customEnabled: customEnabled,
            customTemplateUrl: customTemplateUrl ? customTemplateUrl : defaultUrl,
            customRepoRegex: customRepoRegex ? customRepoRegex : '',
            customRepoDescriptionID: customRepoDescriptionID ? customRepoDescriptionID : ''

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
            bitbucketEnabled: true,
            bitbucketTemplateUrl: defaultUrl,

            customEnabled: true,
            customTemplateUrl: defaultUrl,
            customRepoRegex: '',
            customRepoDescriptionID: ''

        }, function (items) {
            document.getElementById('githubEnabled').checked = items.githubEnabled;
            document.getElementById('githubTemplateUrl').value = items.githubTemplateUrl;
            document.getElementById('bitbucketEnabled').checked = items.bitbucketEnabled;
            document.getElementById('bitbucketTemplateUrl').value = items.githubTemplateUrl;
            
            document.getElementById('customRepoEnabled').checked = items.customEnabled;
            document.getElementById('customRepoTemplateUrl').value = items.customTemplateUrl;
            document.getElementById('customRepoRegex').value = items.customRepoRegex;
            document.getElementById('customRepoDescriptionID').value = items.customRepoDescriptionID;

        });

    }

    document.addEventListener('DOMContentLoaded', restore_options);
    document.getElementById('save').addEventListener('click', save_options);
})();
