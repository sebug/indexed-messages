import ko from 'knockout';
import htmlContent from './component.html';
import messageList from '../message-list/component.js';
import messageEdit from '../message-edit/component.js';
import keyEdit from '../key-edit/component.js';
import getOrSetOnCookie from '../../lib/getOrSetOnCookie.js';
ko.components.register('message-list', messageList);
ko.components.register('message-edit', messageEdit);
ko.components.register('key-edit', keyEdit);

class ViewModel {
    constructor(params) {
	let sps = (new URL(document.location)).searchParams;
	let key = sps.get("key");
	let postKey = sps.get("postKey");
	let partition = sps.get("partition");
	key = getOrSetOnCookie('key', key);
	postKey = getOrSetOnCookie('postKey', postKey);
	partition = getOrSetOnCookie('partition', partition);

	if (!key) {
	    key = localStorage.getItem('key');
	}
	if (!postKey) {
	    postKey = localStorage.getItem('postKey');
	}
	if (!partition) {
	    partition = localStorage.getItem('partition');
	}

	this.key = ko.observable(key);
	if (!this.key()) {
	    this.key.subscribe(newVal => {
		if (newVal) {
		    localStorage.setItem('key', newVal);
		}
	    });
	}
	this.postKey = ko.observable(postKey);
	if (!this.postKey()) {
	    this.postKey.subscribe(newVal => {
		if (newVal) {
		    localStorage.setItem('postKey', newVal);
		}
	    });
	}
	this.partition = ko.observable(partition);
	if (!this.partition()) {
	    this.partition.subscribe(newVal => {
		if (newVal) {
		    localStorage.setItem('partition', newVal);
		}
	    });
	}
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
