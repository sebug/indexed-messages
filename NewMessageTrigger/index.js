let azure = require('azure-storage');

module.exports = function (context, req) {
    let tableService = azure.createTableService();
    context.log(JSON.stringify(req.body));

    context.res = {
	body: req.body
    };
    context.done();
};
