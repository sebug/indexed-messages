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

	this.messages = ko.observableArray([]);
	
	this.getData = this.getData.bind(this);

	this.messagePosted = this.messagePosted.bind(this);

	if (params.registerMessagePostedListener) {
	    params.registerMessagePostedListener(this.messagePosted);
	}

	if (params.addGetAllMessagesCallback) {
	    params.addGetAllMessagesCallback(messages => {
		console.log('got data from the service worker callback, updating messages observable');
		this.messages(event.data.data);
	    });
	}

	setTimeout(() => {
	    this.getData();
	}, 0);

	// Get the data again if partition changes
	this.partition.subscribe(newVal => {
	    if (newVal) {
		this.getData();
	    }
	});
    }

    async getData() {
	let response = await fetch('/api/GetMessagesTrigger?code=' +
				   this.key() + '&partition=' +
				   this.partition());
	let responseModel = await response.json();

	if (responseModel) {
	    this.messages(responseModel);
	}
    }

    messagePosted(message) {
	if (message) {
	    let messagesAfter = this.messages().concat([message]);
	    this.messages(messagesAfter);
	}
    }
}

export default {
    viewModel: ViewModel,
    template: htmlContent
};
