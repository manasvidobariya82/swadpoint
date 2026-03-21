const ORDER_EVENT_HUB_KEY = "__swadpointOrderEventHub__";

const getOrderEventHub = () => {
  if (!globalThis[ORDER_EVENT_HUB_KEY]) {
    globalThis[ORDER_EVENT_HUB_KEY] = {
      listeners: new Set(),
    };
  }

  return globalThis[ORDER_EVENT_HUB_KEY];
};

export const publishOrderEvent = (event) => {
  const hub = getOrderEventHub();

  hub.listeners.forEach((listener) => {
    try {
      listener({
        type: String(event?.type || "orders.changed"),
        orderId: String(event?.orderId || ""),
        timestamp: event?.timestamp || new Date().toISOString(),
      });
    } catch {
      // Ignore stale listener failures and continue broadcasting.
    }
  });
};

export const subscribeToOrderEvents = (listener) => {
  const hub = getOrderEventHub();
  hub.listeners.add(listener);

  return () => {
    hub.listeners.delete(listener);
  };
};
