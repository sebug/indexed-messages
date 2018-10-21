# Indexed Messages
This project is an exploration of IndexedDB together with a function to store some messages (for example radio logs) both client side and synchronizing it with an Azure function regularly.

## Setup
	az group create --name indexedMessages --location westeurope
	az storage account create --name indexedmessages --location westeurope --resource-group indexedMessages --sku Standard_LRS
	az functionapp create --name IndexedMessages --storage-account indexedmessages --resource-group indexedMessages --consumption-plan-location westeurope

Add CI with github. Set function app version to 2.

The build results are put into a storage container.

	az storage container create --name indexedmessagesstatic
	az storage container set-permission --name indexedmessagesstatic --public-access blob

This is done using an Azure Release Pipeline, so I'll elide the details. Super simple though.

You can access the website on https://indexedmessages.azurewebsites.net

## Adding Azure storage table
We will also need a storage table to store the messages we're receiving

	az storage table create --name radioMessages

## The role of IndexedDB
Since we're creating a function app, sending the messages to be inserted into table storage may take some time. The goal is to already insert them in IndexedDB and not wait until the function is actually triggered. We'll have to call back when it fails, though. The background sync API is currently only supported in Chrome, so I'd store the requests in some failed message DB and allow the user to send them again at an opportune time.

# Passing data during add to home screen
Currently, iOS only has very dodgy support for PWAs. One thing that's quite
limiting is that when we're adding to home screen then the saved keys (which
we take from the initial URL) are not taken over. I have thus added an initial configuration screen for that case. That works for the messages app, but for anything more that's really too much.

# Offline
If we try to insert a message while offline, we notify another component that this happens and let the user click on a synchronize button once they're back online (since background sync is not really an option).

One interesting problem that came up here was the fact that you can't serialize the error response when the insertion failed.

# Push Notifications
Well server side they're gonna be a pain for Safari ( https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html#//apple_ref/doc/uid/TP40013225-CH3-SW1 ). Plus, seems like you can't really execute JS after the notification is received (only when the web page is opened).

So to start

	curl --header 'Content-Type: application/json' --request POST --data '{"key1": "value1"}' https://indexedmessages.azurewebsites.net/v2/pushPackages/web.net.azurewebsites.indexedmessages -o package2.zip

Should download the package.zip that will be used to ask for notifications (with icon and all).

The other register and delete functions should work as well.

# Searching by Index
To return the items of the correct partition we use index.getAll, which is not supported by Internet Explorer.


# Builds
Turns out that Azure functions keeps old files around during build. So now I'm kind of screwed until they're invalidated.
