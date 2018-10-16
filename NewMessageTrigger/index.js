let azure = require('azure-storage');

module.exports = function (context, req) {
    let tableService = azure.createTableService();

    context.res = {
	body: {
	    message: 'Blah'
	}
    };
    context.done();
};
