
module.exports = function (context, req) {
    context.log('body is ' + JSON.stringify(req.body));
    context.log('version is ' + req.query.version);
    context.log('website push ID is ' + req.query.websitePushID);

    context.res = {
	body: 'Hello from get push package'
    };
    context.done();
};
