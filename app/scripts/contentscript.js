'use strict';
(function () {
    var defaultUrl = 'https://raw.github.com/sprintly/sprint.ly-culture/master/pr-template.md';
    var options;

    var isGH = window.location.href.match(/github.com/);
    var isBB = window.location.href.match(/bitbucket.org/);

    loadOptions(getTemplate);

    function loadOptions(cb) {
        chrome.storage.sync.get({
            githubEnabled: true,
            githubTemplateUrl: defaultUrl,
            bitbucketEnabled: true,
            bitbucketTemplateUrl: defaultUrl
        }, function (items) {
            options = items;
            cb();
        });
    }

    function insertTemplate(template) {
        var el = null;

        if (isGH && options.githubEnabled) {
            el = document.getElementById('pull_request_body');
        } else if (isBB && options.bitbucketEnabled) {
            el = document.getElementById('id_description');
        }

        if (el !== null) {
            /*
             Bitbucket clears out the PR description field / put in its own content based on commits to be merged.
             We'll append the content.
              */
            if (isBB) {
                setTimeout(function() {
                    el.value = el.value + (el.value.length ? '\r\n' : '') + template;
                }, 1000);
            } else {
                el.value = template;
            }
        }
    }

    function getTemplate() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                insertTemplate(xhr.responseText);
            }
        };

        xhr.open("GET", (isGH ? options.githubTemplateUrl : options.bitbucketTemplateUrl), true);
        xhr.send();
    }
})();



