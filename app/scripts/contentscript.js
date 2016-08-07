'use strict';
(function () {
    var defaultUrl = 'https://raw.github.com/sprintly/sprint.ly-culture/master/pr-template.md';
    var options, isCustom;

    var isGH = window.location.href.match(/github.com/);
    var isBB = window.location.href.match(/bitbucket.org/);

    loadOptions(getTemplate);

    function loadOptions(cb) {
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
        var templateToLoad,
            xhr = new XMLHttpRequest();

        isCustom = (options.customRepoRegex) ? new RegExp(options.customRepoRegex).test(window.location.href) : false;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                insertTemplate(xhr.responseText);
            }
        };

        if(isGH) {
            templateToLoad = options.githubTemplateUrl;
        } else if(isBB) {
            templateToLoad = options.bitbucketTemplateUrl;
        } else if(isCustom) {
            templateToLoad = options.customTemplateUrl;
        }

        if(templateToLoad) {
            xhr.open("GET", (templateToLoad), true);
            xhr.send();
        }

    }
})();



