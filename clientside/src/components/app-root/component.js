import ko from 'knockout';
import htmlContent from './component.html';
import messageList from '../message-list/component.js';
import messageEdit from '../message-edit/component.js';
ko.components.register('message-list', messageList);
ko.components.register('message-edit', messageEdit);

function getOrSetInLocalStorage(propertyName, value) {
    if (value) {
	localStorage.setItem(propertyName, value);
    } else {
	value = localStorage.getItem(propertyName);
    }
    return value;
}

class ViewModel {
    constructor(params) {
	let sps = (new URL(document.location)).searchParams;
	let key = sps.get("key");
	let postKey = sps.get("postKey");
	let partition = sps.get("partition");
	key = getOrSetInLocalStorage('key', key);
	postKey = getOrSetInLocalStorage('postKey', postKey);
	partition = getOrSetInLocalStorage('partition', partition);

	console.log(key, postKey, partition);
	
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
