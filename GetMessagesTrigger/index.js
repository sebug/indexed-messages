module.exports = function (context, req) {
    context.res = {
	body: "Initial data"
    };
    context.done();
};
