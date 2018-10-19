const sharp = require('sharp');

const sizes = [16, 32, 128];

// create icons for push notification
sizes.forEach(size => {
    sharp('../clientside/images/logo_messages.png')
	.resize(size, size)
	.toFile('dist/IndexedMessages.pushpackage/icon.iconset/icon_' + size +
		'x' + size + '.png', (err, info) => {
		    if (err) {
			console.log(JSON.stringify(err));
		    } else {
			console.log('created push notification logo with width ' + info.width);
		    }
		});

    sharp('../clientside/images/logo_messages.png')
	.resize(size * 2, size * 2)
	.toFile('dist/IndexedMessages.pushpackage/icon.iconset/icon_' + size +
		'x' + size + '@2x.png', (err, info) => {
		    if (err) {
			console.log(JSON.stringify(err));
		    } else {
			console.log('created 2x push notification logo with width ' + info.width);
		    }
		});
});
