import ko from 'knockout';
import htmlContent from './component.html';
import Message from '../../models/Message.js';

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
	this.postKey = params.postKey;
	if (typeof this.postKey !== 'function') {
	    this.postKey = ko.observable(this.postKey);
	}
    }
}

export default {
    viewModel: ViewModel,
    template: htmlContent
};
