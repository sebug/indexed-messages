import ko from 'knockout';
import appRoot from './components/app-root/component.js';
ko.components.register('app-root', appRoot);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
	console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
	console.log('ServiceWorker registration failed: ', err);
    });
}

ko.applyBindings({}, document.getElementsByTagName('main')[0]);
