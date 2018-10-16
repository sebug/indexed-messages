// The service worker to be used for this sub-element.
var CACHE_NAME = 'my-static-site-cache-v1.1';
var DYNAMIC_CACHE_NAME = 'my-dynamic-site-cache';
var urlsToCache = [
  '/',
  '/polyfill.min.js',
    '/bundle.js'
];


self.addEventListener('install', function (e) {
    e.waitUntil(
	caches.open(CACHE_NAME)
	    .then(function (cache) {
		console.log('Opened cache ' + CACHE_NAME);
		return cache.addAll(urlsToCache);
	    }, function (err) {
		console.log('could not event open cache ' + CACHE_NAME);
	    }));
});

// Deal with statically cached content
self.addEventListener('fetch', function (e) {
    e.respondWith(
	caches.match(e.request)
	    .then(function (response) {
		if (response) {
		    return response;
		}

		console.log('matched but did not find response');

		// so that we can store both in cache and perform it
		var fetchRequest = e.request.clone();
		return fetch(fetchRequest).then(function (response) {
		    // Check if we received a valid response
		    if(!response || response.status !== 200 || response.type !== 'basic') {
			return response;
		    }

		    var responseToCache = response.clone();

		    caches.open(DYNAMIC_CACHE_NAME)
			.then(function(cache) {
			    cache.put(e.request, responseToCache);
			});

		    return response;
		});
	    }));
});
