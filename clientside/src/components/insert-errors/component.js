import ko from 'knockout';
import htmlContent from './component.html';

class ViewModel {
    constructor(params) {
	this.key = params.key;
	if (typeof this.key !== 'function') {
	    this.key = ko.observable(this.key);
	}
	this.partition = params.partition;
	if (typeof this.partition !== 'function') {
	    this.partition = ko.observable(this.partition);
	}

	this.missedMessages = ko.observableArray([]);

	this.resynchronize = this.resynchronize.bind(this);
	this.postMessagesAgain = this.postMessagesAgain.bind(this);
	this.postToMessageTrigger = this.postToMessageTrigger.bind(this);

	if (params.addInsertionErrorCallback) {
	    console.log('Add insertion error callback defined, setting one');
	    params.addInsertionErrorCallback(data => {
		console.log('got data from the service worker about missed inserts.');
		console.log(data.error);
		let newMessages = this.missedMessages().concat([data.data]);
		this.missedMessages(newMessages);
	    });
	}
    }

    resynchronize() {
	this.postMessagesAgain().then(completed => {
	    this.missedMessages([]);
	});
    }

    async postMessagesAgain() {
	let postPromises = this.missedMessages().map(message => {
	    return this.postToMessageTrigger(message);
	});
	let results = await Promise.all(postPromises);
	console.log(results);
	return results;
    }

    async postToMessageTrigger(obj) {
	let res = await fetch('/api/NewMessageTrigger?code=' + this.key() +
			      '&partition=' + this.partition(), {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        redirect: "follow", // manual, *follow, error
        body: JSON.stringify(obj),
	});
	let resJson = await res.json();
	return resJson;
    }
}

export default {
    viewModel: ViewModel,
    template: htmlContent
};

