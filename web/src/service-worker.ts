import { AccessList } from 'pools-ts';
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.onmessage = async (event) => {
  if (event.data && event.data.type === 'initializeAccessList') {
    const { subsetData } = event.data.payload;

    const accessList = new AccessList({
      accessType: 'blocklist',
      subsetData,
      onProgressUpdate: (progress) => {
        // Send progress update back to the main thread
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'accessListProgress', progress });
          });
        });
      }
    });

    const serializedAccessList = accessList.toJSON()

    // Send accessList back to main thread
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'accessListInitialized', serializedAccessList });
      });
    });
  }
};
