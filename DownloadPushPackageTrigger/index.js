
module.exports = function (context, req, blobContents) {
    context.log('body is ' + JSON.stringify(req.body));
    context.log('version is ' + req.query.version);
    context.log('website push ID is ' + req.query.websitePushID);
    context.log('blob contents are');
    context.log(blobContents);

    context.res = {
	body: 'Hello from get push package'
    };
    context.done();
};
