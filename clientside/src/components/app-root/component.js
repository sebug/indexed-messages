import ko from 'knockout';
import htmlContent from './component.html';
import messageList from '../message-list/component.js';
import messageEdit from '../message-edit/component.js';
ko.components.register('message-list', messageList);
ko.components.register('message-edit', messageEdit);

function getOrSetOnCookie(propertyName, value) {
    if (value) {
	document.cookie = propertyName + '=' + value;
    } else {
	try {
	    value = document.cookie.split(';').map(kvp => { let firstIdx = kvp.indexOf('='); return { key: kvp.substring(0, firstIdx).trim(), value: kvp.substring(firstIdx + 1).trim() } }).filter(o => o.key === propertyName).map(o => o.value)[0];
	    console.log('value is ' + value);
	} catch (e) {
	    console.log(e);
	}
    }
    return value;
}

class ViewModel {
    constructor(params) {
	let sps = (new URL(document.location)).searchParams;
	let key = sps.get("key");
	let postKey = sps.get("postKey");
	let partition = sps.get("partition");
	key = getOrSetOnCookie('key', key);
	postKey = getOrSetOnCookie('postKey', postKey);
	partition = getOrSetOnCookie('partition', partition);

	this.key = ko.observable(key);
	this.postKey = ko.observable(postKey);
	this.partition = ko.observable(partition);
	this.messagePostedCallback = this.messagePostedCallback.bind(this);
	this.registerMessagePostedListener = this.registerMessagePostedListener.bind(this);
	this.messagePostedListeners = [];
    }

    messagePostedCallback(message) {
	if (this.messagePostedListeners) {
	    this.messagePostedListeners.forEach(l => {
		l(message);
	    });
	}
    }

    registerMessagePostedListener(listener) {
	this.messagePostedListeners.push(listener);
    }
}

export default {
    viewModel: ViewModel,
    template: htmlContent
};
