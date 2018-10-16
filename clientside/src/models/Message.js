import ko from 'knockout';

class Message {
    constructor(entity) {
	if (!entity) {
	    entity = {};
	}
	this.dateTime = ko.observable(entity.dateTime);
	this.from = ko.observable(entity.from);
	this.to = ko.observable(entity.to);
	this.message = ko.observable(entity.message);
    }
}

export default Message;
