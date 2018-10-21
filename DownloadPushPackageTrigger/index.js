const azure = require('azure-storage');
const stream = require('stream');

module.exports = function (context, req) {
    context.log('body is ' + JSON.stringify(req.body || {}));
    context.log('version is ' + req.query.version);
    context.log('website push ID is ' + req.query.websitePushID);
    const blobService = azure.createBlobService();
    let outputStream = new stream.Writable();
    outputStream.contents = new Uint8Array(0);

    //Override the write to store the value to our "contents"
    // see https://stackoverflow.com/questions/43810082/azure-functions-nodejs-response-body-as-a-stream
    outputStream._write = function (chunk, encoding, done) {
	context.log('Writing to stream');
        var curChunk = new Uint8Array(chunk);
        var tmp = new Uint8Array(this.contents.byteLength + curChunk.byteLength);
        tmp.set(this.contents, 0);
        tmp.set(curChunk, this.contents.byteLength);
        this.contents = tmp;
        done();
    };

    context.log('starting get blob to stream');
    
    blobService.getBlobToStream('indexedmessagesstatic','package.zip', outputStream, (err, data) => {
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
		    status: 200,
		    headers: {
			'Content-Type': 'application/zip'
		    },
		    isRaw: true,
		    body: outputStream.contents
		};
	    context.done();
	}
    });
    context.log('after get blob to stream started');
};
