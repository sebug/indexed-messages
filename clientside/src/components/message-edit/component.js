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
	this.fromDateHasFocus = ko.observable(false);
	this.fromDateHasFocus.subscribe(hf => {
	    if (hf) {
		this.fillFromDate();
	    }
	});
    }

    fillFromDate() {
	let d = new Date();
	let monthString = '' + (d.getMonth() + 1);
	if (monthString.length === 1) {
	    monthString = '0' + monthString;
	}
	let dayString = '' + d.getDate();
	if (dayString.length === 1) {
	    dayString = '0' + dayString;
	}
	let hourString = '' + d.getHours();
	if (hourString.length === 1) {
	    hourString = '0' + hourString;
	}
	let minuteString = '' + d.getMinutes();
	if (minuteString.length === 1) {
	    minuteString = '0' + minuteString;
	}
	let secondString = '' + d.getSeconds();
	if (secondString.length === 1) {
	    secondString = '0' + secondString;
	}
	let dateString = d.getFullYear() + '-' +
	    monthString + '-' +
	    dayString + ' ' + hourString + ':' +
	    minuteString + ':' + secondString;
	    
	if (!this.message().dateTime()) {
	    this.message().dateTime(dateString);
	}
    }

    postMessage() {
	console.log(this.message().message());
	this.postToMessageTrigger(ko.toJS(this.message())).then(res => {
	    if (this.successCallback) {
		this.successCallback(new Message(res));
		this.message(new Message({}));
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
