// The service worker to be used for this sub-element.
import idb from 'idb';

var CACHE_NAME = 'my-static-site-cache-v1.45';
var DYNAMIC_CACHE_NAME = 'my-dynamic-site-cache-1.45';
var urlsToCache = [
  '/',
  '/polyfill.min.js',
    '/build.js',
    '/static/icon_48x48.png',
    '/static/icon_96x96.png',
    '/static/icon_192x192.png',
    '/static/icon_512x512.png',
    '/static/icon_152x152.png',
    '/static/icon_180x180.png',
    '/static/icon_167x167.png',
    '/static/apple-launch-640x1136.png',
    '/static/apple-launch-1125x2436.png',
    '/static/apple-launch-1242x2208.png',
    '/static/apple-launch-1536x2048.png',
    '/static/apple-launch-1668x2224.png',
    '/static/apple-launch-2048x2732.png',
    '/static/apple-launch-750x1334.png'
];


self.addEventListener('install', function (e) {
    e.waitUntil(
	caches.open(CACHE_NAME)
	    .then(function (cache) {
		return cache.addAll(urlsToCache);
	    }, function (err) {
		console.log('could not event open cache ' + CACHE_NAME);
	    }));

    try {
	// Delete old caches
	let i;
	for (i = 0; i < 45; i += 1) {
	    let cacheKey = 'my-static-site-cache-v1.' + i;
	    caches.delete(cacheKey);
	    let dynamicCacheKey = 'my-dynamic-site-cache-1.' + i;
	    caches.delete(dynamicCacheKey);
	}
    } catch (e) {
	console.log(e);
    }
});

function storeInDynamicCache(request, responseToCache) {
    caches.open(DYNAMIC_CACHE_NAME)
	.then(function(cache) {
	    cache.put(request, responseToCache);
	});
}

function isInvalidResponse(response) {
    return !response || response.status !== 200 || response.type !== 'basic';
}

function cacheThenNetworkStrategy(e) {
    e.respondWith(
	caches.match(e.request)
	    .then(function (response) {
		if (response && e.request.url.indexOf('/api') < 0) {
		    return response;
		}

		// so that we can store both in cache and perform it
		var fetchRequest = e.request.clone();
		return fetch(fetchRequest).then(function (response) {
		    // Check if we received a valid response
		    if(isInvalidResponse(response)) {
			return response;
		    }

		    var responseToCache = response.clone();

		    storeInDynamicCache(e.request, responseToCache);

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

function getFailedMessagesDBPromiseDB() {
    return idb.open('failed-messages-db', 1, function (upgradeDB) {
	console.log('making a new failed messages object store');
	if (!upgradeDB.objectStoreNames.contains('failedMessages')) {
	    upgradeDB.createObjectStore('failedMessages', { keyPath: 'dateTime' });
	}
    });
}

function notifyFullMessages(messages) {
    try {
	self.clients.matchAll().then(all => all.map(client => client.postMessage({
	    type: 'GetAllMessagesResponse',
	    data: messages
	})));
    } catch (e) {
	console.log(e);
    }
};

function notifyInsertionError(message, error) {
    return self.clients.matchAll().then(all => all.map(client => {
	let msg = {
	    type: 'InsertionError',
	    data: message,
	    error: error
	};
	client.postMessage(msg);
    }));
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
	notifyFullMessages(messages);
	return tx.complete;
    }, function (err) {
	console.log(err);
    });
}

function getAllMessagesFromIndexedDB() {
    let dbPromise = getMessagesDBPromise();
    return dbPromise.then(function (db) {
	var tx = db.transaction('messages');
	var store = tx.objectStore('messages');
	return store.getAll();
    }, function (err) {
	console.log(err);
	return null;
    });
}

function storeIndividualMessageInIndexedDB(message) {
    let dbPromise = getMessagesDBPromise();
    return dbPromise.then(function (db) {
	var tx = db.transaction('messages', 'readwrite');
	var store = tx.objectStore('messages');
	store.put(message);
	return tx.complete;
    }, function (err) {
	console.log(err);
    });
}

function storeFailedMessage(message) {
    let dbPromise = getFailedMessagesDBPromiseDB();
    return dbPromise.then(function (db) {
	let tx = db.transaction('failedMessages', 'readwrite');
	let store = tx.objectStore('failedMessages');
	store.put(message);
	return tx.complete;
    }, function (err) {
	console.log(err);
    });
}

function removeFailedMessage(dateTime) {
    let dbPromise = getFailedMessagesDBPromiseDB();
    return dbPromise.then(function (db) {
	let tx = db.transaction('failedMessages', 'readwrite');
	let store = tx.objectStore('failedMessages');
	store.delete(dateTime);
	return tx.complete;
    }, function (err) {
	console.log(err);
    });
}

function getAllFailedMessages() {
    let dbPromise = getFailedMessagesDBPromiseDB();
    return dbPromise.then(function (db) {
	var tx = db.transaction('failedMessages');
	var store = tx.objectStore('failedMessages');
	return store.getAll();
    }, function (err) {
	console.log(err);
	return null;
    });
}

function notifyFailedMessages(messages) {
    try {
	self.clients.matchAll().then(all => all.map(client => client.postMessage({
	    type: 'GetFailedMessagesResponse',
	    data: messages
	})));
    } catch (e) {
	console.log(e);
    }
};

function cacheAndIndexedDBStrategy(e) {
    let clonedRequest = e.request.clone();
    if (e.request && e.request.url && e.request.url.indexOf('/GetMessagesTrigger') >= 0) {
	console.log('go get messages');
	e.respondWith(getAllMessagesFromIndexedDB().then(messages => {
	    if (!messages) {
		return fetch(e.request);
	    } else {
		let response = new Response(JSON.stringify(messages), {
		    headers: { 'Content-Type': 'application/json' }
		});
		return response;
	    }
	}));
	// Also, store the next version of the response in the IndexedDB
	fetch(e.request)
	    .then(function (response) {
		if(isInvalidResponse(response)) {
		    return response;
		}

		let responseToCache = response.clone();
		responseToCache.json().then(storeFullResultsInIndexedDB);

		return response;
	    });
    } else if (e.request && e.request.url && e.request.url.indexOf('/NewMessage') >= 0) {
	e.respondWith(clonedRequest.json().then(message => {
	    return storeIndividualMessageInIndexedDB(message).then((transactionState) => {
		return new Response(JSON.stringify(message), { headers: { 'Content-Type': 'application/json' } });
	    });
	}));
	// Also perform the actual fetch request to store the message
	// TODO: error handling for offline
	let secondClonedRequest = e.request.clone();
	e.waitUntil(fetch(e.request)
		   .then(function (response) {
		       if(isInvalidResponse(response)) {
			   return secondClonedRequest.json().then(message => {
			       notifyInsertionError(message, "Invalid response: " + response.status);
			       return new Response(JSON.stringify(message), { headers: { 'Content-Type': 'application/json' } });
			   });
		       }

		       let responseToCache = response.clone();

		       // we actually successfully inserted this message now. Remove it from the failed messages if it is there
		       responseToCache.json().then(message => {
			   removeFailedMessage(message.dateTime);
		       });
			  
		       return response;
		   }).then(null, err => {
		       return secondClonedRequest.json().then(message => {
			   notifyInsertionError(message, 'failed to fetch');
			   return storeFailedMessage(message).then(t => {
			       return new Response(JSON.stringify(message), { headers: { 'Content-Type': 'application/json' } });
			   });
		       });
		   }));
    } else {
	e.respondWith(fetch(e.request)
		      .then(function (response) {
			  if(isInvalidResponse(response)) {
			      return response;
			  }

			  return response;
		      }));
    }
}

// Deal with statically cached content
self.addEventListener('fetch', function (e) {
    if (!e || !e.request || e.request.url.indexOf('/api') < 0) {
	cacheThenNetworkStrategy(e);
    } else {
	cacheAndIndexedDBStrategy(e);
    }
});

// Communicate with the clients
self.addEventListener('message', function (event) {
    console.log('Service Worker received message');
    if (event.data == 'get-failed-messages') {
	getAllFailedMessages().then(notifyFailedMessages);
    }
    console.log(event.data);
});
