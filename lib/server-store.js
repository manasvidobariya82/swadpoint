import { promises as fs } from "fs";
import path from "path";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "restaurant-store.json");

const DEFAULT_STORE = {
  orders: [],
  payments: [],
};

let writeQueue = Promise.resolve();

const normalizeStore = (raw) => ({
  orders: Array.isArray(raw?.orders) ? raw.orders : [],
  payments: Array.isArray(raw?.payments) ? raw.payments : [],
});

const ensureStoreFile = async () => {
  await fs.mkdir(STORE_DIR, { recursive: true });

  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
  }
};

const readStore = async () => {
  await ensureStoreFile();

  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    return normalizeStore(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_STORE };
  }
};

const writeStore = async (store) => {
  await ensureStoreFile();
  const nextStore = normalizeStore(store);
  await fs.writeFile(STORE_FILE, JSON.stringify(nextStore, null, 2), "utf8");
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
