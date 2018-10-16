import ko from 'knockout';
import htmlContent from './component.html';

class ViewModel {
    constructor(params) {
	this.key = params.key;
	if (typeof this.key !== 'function') {
	    this.key = ko.observable(this.key);
	}

	console.log('The key in the sub component is ' + this.key());

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
	let response = await fetch('/api/GetMessagesTrigger?code=' + this.key());
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
