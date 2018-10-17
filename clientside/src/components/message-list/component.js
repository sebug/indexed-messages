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

	console.log('the partition is ' + this.partition());

	this.messages = ko.observableArray([]);
	
	this.getData = this.getData.bind(this);

	this.messagePosted = this.messagePosted.bind(this);

	if (params.registerMessagePostedListener) {
	    params.registerMessagePostedListener(this.messagePosted);
	}

	setTimeout(() => {
	    this.getData();
	}, 0);
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
