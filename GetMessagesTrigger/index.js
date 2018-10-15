module.exports = function (context, req) {
    context.res = {
	body: {
	    msg: "Hey from JSON"
	}
    };
    context.done();
};
