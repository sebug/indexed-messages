# Indexed Messages
This project is an exploration of IndexedDB together with a function to store some messages (for example radio logs) both client side and synchronizing it with an Azure function regularly.

# Setup
	az group create --name indexedMessages --location westeurope
	az storage account create --name indexedmessages --location westeurope --resource-group indexedMessages --sku Standard_LRS
	az functionapp create --name IndexedMessages --storage-account indexedmessages --resource-group indexedMessages --consumption-plan-location westeurope

Add CI with github. Set function app version to 2.

The build results are put into a storage container.

	az storage container create --name indexedmessagesstatic
	az storage container set-permission --name indexedmessagesstatic --public-access blob

The following steps will be done automatically by the pipeline, but in the meantime and for reference

	az storage blob upload --container-name indexedmessagesstatic --file clientside/dist/index.html --name index.html --content-type "text/html"
	az storage blob upload --container-name indexedmessagesstatic --file clientside/dist/build.js --name build.js --content-type "application/javascript"

