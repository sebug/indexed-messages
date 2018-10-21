const azure = require('azure-storage');

module.exports = function (context, req) {
    context.log('Registering device permission policy');

    const deviceToken = req.query.deviceToken;
    const websitePushID = req.query.websitePushID;

    context.log('device token is ' + deviceToken);
    context.log('website push ID is ' + websitePushID);

    const tableService = azure.createTableService();
    const entGen = azure.TableUtilities.entityGenerator;

    const entity = {
	PartitionKey: entGen.String('prod'),
	RowKey: entGen.String(deviceToken),
	WebsitePushID: entGen.String(websitePushID)
    };

    tableService.insertOrReplaceEntity('registeredDevices', entity, (error, result, response) => {
	if (!error) {
	    context.res = {
		body: 'OK'
	    };
	    context.done();
	} else {
	    context.log(JSON.stringify(error));
	    context.res = {
		status: 500,
		body: 'Error inserting device registration'
	    };
	    context.done();
	}
    });
};
