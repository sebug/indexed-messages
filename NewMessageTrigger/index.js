let azure = require('azure-storage');

module.exports = function (context, req) {
    let tableService = azure.createTableService();
    let entGen = azure.TableUtilities.entityGenerator;

    let partition = req.query.partition || 'prod';

    context.log('Partition is ' + partition);
    
    let entity = {
	PartitionKey: entGen.String('prod'),
	RowKey: entGen.String(req.body.dateTime),
	From: entGen.String(req.body.from),
	To: entGen.String(req.body.to),
	Message: entGen.String(req.body.message)
    };
    tableService.insertEntity('radioMessages', entity, function(error, result, response) {
	if (!error) {
	    context.log(JSON.stringify(result));
	    context.res = {
		body: req.body
	    };
	    context.done();
	} else {
	    context.log(JSON.stringify(error));
	    context.res = {
		status: 400,
		body: "Error inserting entity"
	    };
	    context.done();
	}
});
};
