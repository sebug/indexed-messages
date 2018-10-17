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
we take from the initial URL) are not taken over. Therefore, we try to accomplish this with an additional cache. Let's see whether that works.
