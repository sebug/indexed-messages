const azure = require('azure-storage');

module.exports = function (context, req) {
    context.log('Logging device registration error');

    const tableService = azure.createTableService();
    const entGen = azure.TableUtilities.entityGenerator;

    const entity = {
	PartitionKey: entGen.String('prod'),
	RowKey: entGen.String(new Date().toString()),
	Log: JSON.stringify(req.body.logs)
    };

    tableService.insertOrReplaceEntity('deviceRegistrationLogs', entity, (error, result, response) => {
	if (!error) {
	    context.res = {
		body: 'OK'
	    };
	    context.done();
	} else {
	    context.log(JSON.stringify(error));
	    context.res = {
		status: 500,
		body: 'Error inserting device registration log'
	    };
	    context.done();
	}
    });
};
