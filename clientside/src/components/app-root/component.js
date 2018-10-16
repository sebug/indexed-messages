import ko from 'knockout';
import htmlContent from './component.html';
import messageList from '../message-list/component.js';
import messageEdit from '../message-edit/component.js';
ko.components.register('message-list', messageList);
ko.components.register('message-edit', messageEdit);

class ViewModel {
    constructor(params) {
	let sps = (new URL(document.location)).searchParams;
	let key = sps.get("key");
	this.key = ko.observable(key);
    }
}

export default {
    viewModel: ViewModel,
    template: htmlContent
};
