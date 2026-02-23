import { openDB } from 'idb';

const DB_NAME = 'ArtisanMarketDB';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Products store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', {
          keyPath: 'id',
          autoIncrement: false,
        });
        productStore.createIndex('name', 'name', { unique: false });
      }

      // Sales store
      if (!db.objectStoreNames.contains('sales')) {
        const salesStore = db.createObjectStore('sales', {
          keyPath: 'id',
          autoIncrement: false,
        });
        salesStore.createIndex('date', 'date', { unique: false });
        salesStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', {
          keyPath: 'key',
        });
      }
    },
  });
};

// Products operations
export const addProduct = async (product) => {
  const db = await initDB();
  return db.add('products', product);
};

export const updateProduct = async (product) => {
  const db = await initDB();
  return db.put('products', product);
};

export const deleteProduct = async (id) => {
  const db = await initDB();
  return db.delete('products', id);
};

export const getAllProducts = async () => {
  const db = await initDB();
  return db.getAll('products');
};

export const getProduct = async (id) => {
  const db = await initDB();
  return db.get('products', id);
};

// Sales operations
export const addSale = async (sale) => {
  const db = await initDB();
  return db.add('sales', sale);
};

export const updateSale = async (sale) => {
  const db = await initDB();
  return db.put('sales', sale);
};

export const deleteSale = async (id) => {
  const db = await initDB();
  return db.delete('sales', id);
};

export const getAllSales = async () => {
  const db = await initDB();
  return db.getAll('sales');
};

export const getSale = async (id) => {
  const db = await initDB();
  return db.get('sales', id);
};

export const getSalesByDateRange = async (startDate, endDate) => {
  const db = await initDB();
  const allSales = await db.getAll('sales');
  return allSales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
  });
};

// Settings operations
export const setSetting = async (key, value) => {
  const db = await initDB();
  return db.put('settings', { key, value });
};

export const getSetting = async (key) => {
  const db = await initDB();
  const result = await db.get('settings', key);
  return result?.value;
};