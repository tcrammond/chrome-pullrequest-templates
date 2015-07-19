'use strict';

var templateUrl = 'https://raw.github.com/sprintly/sprint.ly-culture/master/pr-template.md';
var autoInsert = true;

getTemplate();

function insertTemplate(template) {
  if (autoInsert) {
    var gh = document.getElementById('pull_request_body');
    var bb = document.getElementById('id_description');
    if (gh !== null) {
      gh.value = template;
    }
    if (bb !== null) {
      bb.value = template;
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

  xhr.open("GET",
    templateUrl,
    true);
  xhr.send();
}

