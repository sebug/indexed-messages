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
    }
}

export default {
    viewModel: ViewModel,
    template: htmlContent
};
