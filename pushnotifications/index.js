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

const websiteInfo = {
    websiteName: 'Journal des messages',
    websitePushID: 'web.net.azurewebsites.indexedmessages',
    allowedDomains: [ 'https://indexedmessages.azurewebsites.net' ],
    urlFormatString: 'https://indexedmessages.azurewebsites.net?partition=%@',
    authenticationToken: process.env.PUSH_NOTIFICATION_AUTHENTICATION_TOKEN,
    webServiceUrl: 'https://indexedmessages.azurewebsites.net/push'
};
const websiteInfoJSON = JSON.stringify(websiteInfo);

console.log(websiteInfoJSON);

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
