// Additional build steps here
// Resizing images
const sharp = require('sharp');

const sizes = [48, 96, 192, 512, 152, 180, 167];

sizes.forEach(size => {
    sharp('images/logo_messages.png')
    .resize(size, size)
    .toFile('dist/icon_' + size + 'x' + size + '.png', (err, info) => {
	if (err) {
	    console.log(JSON.stringify(err));
	} else {
	    console.log('created logo with width ' + info.width);
	}
    });
});


