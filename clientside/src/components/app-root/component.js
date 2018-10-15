import ko from 'knockout';
import htmlContent from './component.html';

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
