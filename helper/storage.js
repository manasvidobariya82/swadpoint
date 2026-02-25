const STORAGE_KEYS = {
  menu: "restaurantMenu",
  orders: "restaurantOrders",
  payments: "restaurantPayments",
  tables: "table-qr-codes",
  paymentConfig: "restaurantPaymentConfig",
};

const readJSON = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getMenu = () => readJSON(STORAGE_KEYS.menu, []);
export const saveMenu = (menu) => writeJSON(STORAGE_KEYS.menu, menu);

export const getOrders = () => readJSON(STORAGE_KEYS.orders, []);
export const saveOrders = (orders) => writeJSON(STORAGE_KEYS.orders, orders);

export const getPayments = () => readJSON(STORAGE_KEYS.payments, []);
export const savePayments = (payments) =>
  writeJSON(STORAGE_KEYS.payments, payments);

export const getTables = () => readJSON(STORAGE_KEYS.tables, []);
export const saveTables = (tables) => writeJSON(STORAGE_KEYS.tables, tables);

export const getPaymentConfig = () =>
  readJSON(STORAGE_KEYS.paymentConfig, {
    upiId: "swadpoint@upi",
    payeeName: "SwadPoint Restaurant",
  });

export const savePaymentConfig = (config) =>
  writeJSON(STORAGE_KEYS.paymentConfig, config);
