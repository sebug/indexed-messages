const https = require('https');

module.exports = function (context, req) {
    context.log('body is ' + JSON.stringify(req.body));
    context.log('version is ' + req.query.version);
    context.log('website push ID is ' + req.query.websitePushID);
    context.log('blob contents are');

    const zipRequest = http.request('https://indexedmessages.azurewebsites.net/static/package.zip', (res) => {
	var body = "";

	res.on("data", (chunk) => {
	    body += chunk;
	});

	res.on("end", () => {
	    context.res = {
		body: body,
		status: 200,
		headers: {
		    'Content-Type': 'application/zip'
		}
	    };
	    context.done();
	});
    });
};
