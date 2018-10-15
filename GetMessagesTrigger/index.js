let azure = require('azure-storage');

module.exports = function (context, req) {
    let tableService = azure.createTableService();
    let query = new azure.TableQuery()
	.top(100)
	.where('PartitionKey eq ?', 'prod');

    tableService.queryEntities('mytable', query, null, function(error, result, response) {
	if (!error) {
	    context.log('Got something back');
	    context.log(JSON.stringify(result.entries));
	    context.res = {
		body: {
		    msg: "Hey from JSON"
		}
	    };
	    context.done();
	} else {
	    context.res = {
		body: []
	    };
	    context.done();
	}
    });
};
