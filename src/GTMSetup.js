import TagManager from 'react-gtm-module';

// Initialize GTM with a given container ID
export const initializeGTM = (containerId) => {
  if (containerId) {
    TagManager.initialize({ gtmId: containerId });
  }
};

// Push an event to the GTM data layer (optional)
export const pushGTMEvent = (eventName, eventData) => {
  TagManager.dataLayer({ event: eventName, ...eventData });
};
