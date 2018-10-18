import ko from 'knockout';
import htmlContent from './component.html';

class ViewModel {
    constructor(params) {
	this.key = params.key;
	if (typeof this.key !== 'function') {
	    this.key = ko.observable(this.key);
	}

	this.missedMessages = ko.observableArray([]);

	if (params.addInsertionErrorCallback) {
	    params.addInsertionErrorCallback(data => {
		console.log('got data from the service worker about missed inserts.');
		console.log(data.error);
		let newMessages = this.missedMessages().concat([data.data]);
		this.missedMessages(newMessages);
	    });
	}
    }
}

export default {
    viewModel: ViewModel,
    template: htmlContent
};

