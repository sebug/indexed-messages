const azure = require('azure-storage');

module.exports = function (context, req) {
    context.log('body is ' + JSON.stringify(req.body || {}));
    context.log('version is ' + req.query.version);
    context.log('website push ID is ' + req.query.websitePushID);
    const blobService = azure.createBlobService();
    blobService.getBlobToText('indexedmessagesstatic','package.zip', (err, data) => {
	if (err) {
	    context.log('error');
	    context.log(err);
	    context.res = {
		status: 500,
		body: err.message
	    };
	    context.done();
	} else {
	    context.log('Got data');
		context.res = {
		    body: data,
		    status: 200,
		    headers: {
			'Content-Type': 'application/zip'
		    }
		};
	    context.done();
	}
    });
};
