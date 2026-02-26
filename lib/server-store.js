import { promises as fs } from "fs";
import os from "os";
import path from "path";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "restaurant-store.json");
const TMP_STORE_FILE = path.join(
  os.tmpdir(),
  "swadpoint",
  "restaurant-store.json"
);

const DEFAULT_STORE = {
  menu: [],
  orders: [],
  payments: [],
};

let writeQueue = Promise.resolve();
let resolvedStoreFilePromise = null;

const normalizeStore = (raw) => ({
  menu: Array.isArray(raw?.menu) ? raw.menu : [],
  orders: Array.isArray(raw?.orders) ? raw.orders : [],
  payments: Array.isArray(raw?.payments) ? raw.payments : [],
});

const ensureStoreFile = async (filePath) => {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
  }
};

const getStoreFilePath = async () => {
  if (!resolvedStoreFilePromise) {
    resolvedStoreFilePromise = (async () => {
      const candidates = [STORE_FILE, TMP_STORE_FILE];

      for (const filePath of candidates) {
        try {
          await ensureStoreFile(filePath);
          return filePath;
        } catch {
          // Try next path.
        }
      }

      throw new Error("No writable store path available");
    })();
  }

  return resolvedStoreFilePromise;
};

const readStore = async () => {
  const filePath = await getStoreFilePath();

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return normalizeStore(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_STORE };
  }
};

const writeStore = async (store) => {
  const filePath = await getStoreFilePath();
  const nextStore = normalizeStore(store);
  await fs.writeFile(filePath, JSON.stringify(nextStore, null, 2), "utf8");
  return nextStore;
};

const withWriteLock = async (task) => {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => {});
  return next;
};

export const getOrdersFromStore = async () => {
  const store = await readStore();
  return store.orders;
};

export const getMenuFromStore = async () => {
  const store = await readStore();
  return store.menu;
};

export const replaceMenuInStore = async (menuItems) =>
  withWriteLock(async () => {
    const store = await readStore();
    store.menu = Array.isArray(menuItems) ? menuItems : [];
    await writeStore(store);
    return store.menu;
  });

export const addOrderToStore = async (order) =>
  withWriteLock(async () => {
    const store = await readStore();
    store.orders.push(order);
    await writeStore(store);
    return order;
  });

export const updateOrderInStore = async (id, partial) =>
  withWriteLock(async () => {
    const store = await readStore();
    const index = store.orders.findIndex((order) => order?.id === id);
    if (index === -1) return null;

    const updatedOrder = {
      ...store.orders[index],
      ...partial,
    };
    store.orders[index] = updatedOrder;
    await writeStore(store);
    return updatedOrder;
  });

export const getPaymentsFromStore = async () => {
  const store = await readStore();
  return store.payments;
};

export const addPaymentToStore = async (payment) =>
  withWriteLock(async () => {
    const store = await readStore();
    store.payments.push(payment);
    await writeStore(store);
    return payment;
  });
