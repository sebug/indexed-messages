const azure = require('azure-storage');

module.exports = function (context, req) {
    context.log('Forgetting device permission policy');

    const deviceToken = req.query.deviceToken;
    const websitePushID = req.query.websitePushID;

    context.log('device token is ' + deviceToken);
    context.log('website push ID is ' + websitePushID);

    const tableService = azure.createTableService();
    const entGen = azure.TableUtilities.entityGenerator;

    var task = {
	PartitionKey: {'_':'prod'},
	RowKey: {'_': deviceToken}
    };

    tableSvc.deleteEntity('registeredDevices', task, function(error, response){
	if (!error) {
	    context.res = {
		body: 'OK'
	    };
	    context.done();
	} else {
	    context.log(JSON.stringify(error));
	    context.res = {
		status: 500,
		body: 'Error forgetting device registration'
	    };
	    context.done();
	}
    });
};
