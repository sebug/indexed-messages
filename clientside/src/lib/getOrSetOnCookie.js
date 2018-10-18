// Gets information from a cookie and sets it if it is not there
function getOrSetOnCookie(propertyName, value) {
    if (value) {
	let date = new Date();
	
	date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
	document.cookie = propertyName + '=' + value + '; expires=' +
	    date.toUTCString() + '; path=/';
    } else {
	try {
	    value = document.cookie.split(';').map(kvp => { let firstIdx = kvp.indexOf('='); return { key: kvp.substring(0, firstIdx).trim(), value: kvp.substring(firstIdx + 1).trim() } }).filter(o => o.key === propertyName).map(o => o.value)[0];
	    console.log('value is ' + value);
	} catch (e) {
	    console.log(e);
	}
    }
    return value;
}

export default getOrSetOnCookie;

