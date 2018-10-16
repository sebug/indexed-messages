// The service worker to be used for this sub-element.
import idb from 'idb';

var CACHE_NAME = 'my-static-site-cache-v1.8';
var DYNAMIC_CACHE_NAME = 'my-dynamic-site-cache';
var urlsToCache = [
  '/',
  '/polyfill.min.js',
    '/build.js'
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

function cacheThenNetworkStrategy(e) {
    e.respondWith(
	caches.match(e.request)
	    .then(function (response) {
		if (response && e.request.url.indexOf('/api') < 0) {
		    return response;
		}

		console.log('matched but did not find response, or response is stale');

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
}

function getMessagesDBPromise() {
    return idb.open('messages-db', 2, function (upgradeDB) {
	console.log('making a new object store');
	if (!upgradeDB.objectStoreNames.contains('messages')) {
	    upgradeDB.createObjectStore('messages', { keyPath: 'dateTime' });
	}
    });
}

function storeFullResultsInIndexedDB(messages) {
    let dbPromise = getMessagesDBPromise();
    dbPromise.then(function (db) {
	var tx = db.transaction('messages', 'readwrite');
	var store = tx.objectStore('messages');
	if (messages && messages.length) {
	    messages.forEach(message => {
		store.put(message);
	    });
	}
	return tx.complete;
    }, function (err) {
	console.log(err);
    });
    
    console.log(idb);
    console.log(messages);
}

function storeIndividualMessageInIndexedDB(message) {
    let dbPromise = getMessagesDBPromise();
    dbPromise.then(function (db) {
	var tx = db.transaction('messages', 'readwrite');
	var store = tx.objectStore('messages');
	store.put(message);
	return tx.complete;
    }, function (err) {
	console.log(err);
    });
}

function cacheAndIndexedDBStrategy(e) {
	let clonedRequest = e.request.clone();
    e.respondWith(fetch(e.request)
		  .then(function (response) {
		      if(!response || response.status !== 200 || response.type !== 'basic') {
			  return response;
		      }

		      let responseToCache = response.clone();
		      if (e.request.url.indexOf('/GetMessagesTrigger') >= 0) {
			  responseToCache.json().then(storeFullResultsInIndexedDB);
		      } else if (e.request.url.indexOf('/NewMessage') >= 0) {
			  clonedRequest.json().then(storeIndividualMessageInIndexedDB);
		      }

		      return response;
		  }));
}

// Deal with statically cached content
self.addEventListener('fetch', function (e) {
    if (!e || !e.request || e.request.url.indexOf('/api') < 0) {
	cacheThenNetworkStrategy(e);
    } else {
	cacheAndIndexedDBStrategy(e);
    }
});
