import ko from 'knockout';
import htmlContent from './component.html';
import messageList from '../message-list/component.js';
import messageEdit from '../message-edit/component.js';
import keyEdit from '../key-edit/component.js';
import insertErrors from '../insert-errors/component.js';
import getOrSetOnCookie from '../../lib/getOrSetOnCookie.js';
ko.components.register('message-list', messageList);
ko.components.register('message-edit', messageEdit);
ko.components.register('key-edit', keyEdit);
ko.components.register('insert-errors', insertErrors);

function checkRemotePermission(permissionData) {
    if (permissionData.permission === 'default') {
        // This is a new web service URL and its validity is unknown.
        window.safari.pushNotification.requestPermission(
            'https://indexedmessages.azurewebsites.net',
            'web.net.azurewebsites.indexedmessages',
            { message: 'Coming from JavaScript' },
            checkRemotePermission
        );
    }
    else if (permissionData.permission === 'denied') {
	console.log('The use said no.');
    }
    else if (permissionData.permission === 'granted') {
        console.log('the user already said yes');
    }
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
	this.insertionErrorListeners = [];
	this.addInsertionErrorCallback = this.addInsertionErrorCallback.bind(this);
	this.getAllMessagesListeners = [];
	this.addGetAllMessagesCallback = this.addGetAllMessagesCallback.bind(this);
	this.getFailedMessagesListeners = [];
	this.addGetFailedMessagesCallback = this.addGetFailedMessagesCallback.bind(this);

	this.showParameters = ko.observable(false);

	navigator.serviceWorker.addEventListener('message', (event) => {
	    console.log(event);
	    if (event.data && event.data.type === 'GetAllMessagesResponse' &&
	       event.data.data) {
		this.getAllMessagesListeners.forEach(l => {
		    console.log('calling back with messages');
		    l(event.data.data);
		});
	    } else if (event.data && event.data.type === 'InsertionError') {
		this.insertionErrorListeners.forEach(l => {
		    console.log('calling back with errors');
		    l(event.data);
		});
	    } else if (event.data && event.data.type === 'GetFailedMessagesResponse') {
		this.getFailedMessagesListeners.forEach(l => {
		    console.log('calling back failed messages');
		    l(event.data.data);
		});
	    }
	});


	setTimeout(() => {
	    if ('safari' in window && 'pushNotification' in window.safari) {
		let permissionData = window.safari.pushNotification.permission('web.net.azurewebsites.indexedmessages');
		
	    } else if ('Notification' in window) {
		Notification.requestPermission(status => {
		    console.log('Notification permission status: ', status);
		});
	    }
	}, 0);
    }

    messagePostedCallback(message) {
	if (this.messagePostedListeners) {
	    this.messagePostedListeners.forEach(l => {
		l(message);
	    });
	}
    }

    addGetAllMessagesCallback(listener) {
	this.getAllMessagesListeners.push(listener);
    }

    addInsertionErrorCallback(listener) {
	console.log('Adding insertion error listener');
	this.insertionErrorListeners.push(listener);
    }

    addGetFailedMessagesCallback(listener) {
	console.log('Adding get failed messages listener');
	this.getFailedMessagesListeners.push(listener);
    }

    registerMessagePostedListener(listener) {
	this.messagePostedListeners.push(listener);
    }
}

export default {
    viewModel: ViewModel,
    template: htmlContent
};
