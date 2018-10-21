const https = require('https');

module.exports = function (context, req) {
    context.log('body is ' + JSON.stringify(req.body));
    context.log('version is ' + req.query.version);
    context.log('website push ID is ' + req.query.websitePushID);
    context.log('starting zip request');

    try {
	const options = {
	    timeout: 10 * 1000
	};
	const zipRequest = https.request('https://indexedmessages.blob.core.windows.net/indexedmessagesstatic/package.zip', options, (res) => {
	    var body = "";
	    context.log('getting res');
	    
	    res.on("data", (chunk) => {
		context.log('got data');
		body += chunk;
	    });

	    res.on("end", () => {
		context.log('ending request');
		context.res = {
		    body: body,
		    status: 200,
		    headers: {
			'Content-Type': 'application/zip'
		    }
		};
		context.done();
	    });
	}).on('error', (err) => {
	    context.log('error');
	    context.log(JSON.stringify(err));
	    context.res = {
		status: 500,
		body: err.message
	    };
	    context.done();
	});
    } catch (e) {
	context.log(e);
	context.res = {
		status: 500,
		body: 'an error occurred'
	};
	context.done();
    }
};
