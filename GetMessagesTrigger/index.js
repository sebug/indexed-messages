let azure = require('azure-storage');

module.exports = function (context, req) {
    let tableService = azure.createTableService();
    let query = new azure.TableQuery()
	.top(100)
	.where('PartitionKey eq ?', 'prod');

    tableService.queryEntities('radioMessages', query, null, function(error, result, response) {
	if (!error) {
	    let entries = result.entries.map(row => {
		return {
		    date: row.RowKey._,
		    from: row.From._,
		    to: row.To._,
		    message: row.Message._
		};
	    });
	    context.log(JSON.stringify(entries));
	    context.res = {
		body: entries
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
