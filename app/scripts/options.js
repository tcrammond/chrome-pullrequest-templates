'use strict';
(function () {
    var defaultUrl = 'https://raw.github.com/sprintly/sprint.ly-culture/master/pr-template.md';


    // Saves options to chrome.storage
    function save_options() {

        var githubEnabled = document.getElementById('githubEnabled').checked;
        var githubTemplateUrl = document.getElementById('githubTemplateUrl').value;
        var bitbucketEnabled = document.getElementById('bitbucketEnabled').checked;
        var bitbucketTemplateUrl = document.getElementById('bitbucketTemplateUrl').value;

        chrome.storage.sync.set({
            githubEnabled: githubEnabled,
            githubTemplateUrl: githubTemplateUrl ? githubTemplateUrl : defaultUrl,
            bitbucketEnabled: bitbucketEnabled,
            bitbucketTemplateUrl: bitbucketTemplateUrl ? bitbucketTemplateUrl : defaultUrl
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
            bitbucketTemplateUrl: defaultUrl
        }, function (items) {
            document.getElementById('githubEnabled').checked = items.githubEnabled;
            document.getElementById('githubTemplateUrl').value = items.githubTemplateUrl;
            document.getElementById('bitbucketEnabled').checked = items.bitbucketEnabled;
            document.getElementById('bitbucketTemplateUrl').value = items.githubTemplateUrl;
        });

    }

    document.addEventListener('DOMContentLoaded', restore_options);
    document.getElementById('save').addEventListener('click', save_options);
})();
