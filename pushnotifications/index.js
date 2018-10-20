const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs-extra');

const sizes = [16, 32, 128];
const sizesWithMultiplier = sizes.map(size => {
    return {
	size: size,
	times: 1
    };
}).concat(sizes.map(size => {
    return {
	size: size,
	times: 2
    };
}));

// create icons for push notification
const filePrefix = 'dist/IndexedMessages.pushpackage/';
Promise.all(sizesWithMultiplier.map(o => {
    return sharp('../clientside/images/logo_messages.png')
	.resize(o.size * o.times, o.size * o.times)
        .toBuffer()
        .then(resizedImageBuffer => {
	    const sha512Sum = crypto.createHash('sha512');
	    sha512Sum.update(resizedImageBuffer);
	    const digest = sha512Sum.digest('hex');
	    const fileNamePart = 'icon.iconset/icon_' + o.size +
		'x' + o.size + (o.times === 2 ? '@2x': '') + '.png';
	    const fileName = filePrefix + fileNamePart;
	    return fs.outputFile(fileName, resizedImageBuffer).then(() => {
		return {
		    fileName: fileNamePart,
		    hashType: 'sha512',
		    hashValue: digest
		};
	    });
	});
})).then(filesWithDigest => {
    console.log(filesWithDigest);
});
