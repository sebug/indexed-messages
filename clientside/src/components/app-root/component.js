import ko from 'knockout';
import htmlContent from './component.html';
import messageList from '../message-list/component.js';
import messageEdit from '../message-edit/component.js';
ko.components.register('message-list', messageList);
ko.components.register('message-edit', messageEdit);

function getOrSetOnCookie(propertyName, value) {
    if (value) {
	let date = new Date();
	
	date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
	document.cookie = propertyName + '=' + value + '; expires=' +
	    date.toUTCString() + '; path=/';
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

	// Also, set them in the information cache
	if (window.caches) {
	    window.caches.open('INFORMATION').then(cache => {
		if (key) {
		    cache.put('key', new Response(key));
		}
		if (postKey) {
		    cache.put('postKey', new Response(postKey));
		}
		if (partition) {
		    cache.put('partition', new Response(partition));
		}
	    });
	}

	this.key = ko.observable(key);
	this.postKey = ko.observable(postKey);
	this.partition = ko.observable(partition);
	this.messagePostedCallback = this.messagePostedCallback.bind(this);
	this.registerMessagePostedListener = this.registerMessagePostedListener.bind(this);
	this.messagePostedListeners = [];

	if (!this.key() || !this.postKey() || !this.partition()) {
	    alert("Don't have a partition");
	    setTimeout(() => {
		caches.match('partition').then(response => {
		    return response.text();
		}).then(kt => {
		    this.partition(kt || this.partition());
		}, err => {
		    alert("Error getting partition " + err);
		});
		caches.match('postKey').then(response => {
		    return response.text();
		}).then(kt => {
		    this.postKey(kt || this.postKey());
		});
		caches.match('key').then(response => {
		    return response.text();
		}).then(kt => {
		    this.key(kt || this.key());
		});
	    }, 0);
	}
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
