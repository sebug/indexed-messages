import ko from 'knockout';
import htmlContent from './component.html';
import Message from '../../models/Message.js';

class ViewModel {
    constructor(params) {
	this.key = params.key;
	if (typeof this.key !== 'function') {
	    this.key = ko.observable(this.key);
	}
	this.message = ko.observable(new Message({}));
	this.postMessage = this.postMessage.bind(this);
	this.postToMessageTrigger = this.postToMessageTrigger.bind(this);
	this.successCallback = params.successCallback;
	this.fillFromDate = this.fillFromDate.bind(this);
    }

    fillFromDate() {
	console.log('Should fill from date');
    }

    postMessage() {
	console.log(this.message().message());
	this.postToMessageTrigger(ko.toJS(this.message())).then(res => {
	    if (this.successCallback) {
		this.successCallback(res);
	    }
	});
	return false;
    }

    async postToMessageTrigger(obj) {
	let res = await fetch('/api/NewMessageTrigger?code=' + this.key(), {
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
