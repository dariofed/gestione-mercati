import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDB } from '@/utils/db';

const DBContext = createContext(null);

export const useDB = () => {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDB must be used within DBProvider');
  }
  return context;
};

export const DBProvider = ({ children }) => {
  const [dbInstance, setDbInstance] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const db = await initDB();
        setDbInstance(db);
        setIsInitialized(true);
        console.log('IndexedDB initialized successfully');
      } catch (err) {
        console.error('Failed to initialize IndexedDB:', err);
        setError(err);
      }
    };

    initialize();
  }, []);

  return (
    <DBContext.Provider value={{ db: dbInstance, isInitialized, error }}>
      {children}
    </DBContext.Provider>
  );
};