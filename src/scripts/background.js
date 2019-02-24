'use strict';
const browser = require('webextension-polyfill');
browser.browserAction.setBadgeText({ text: 'PR' });
