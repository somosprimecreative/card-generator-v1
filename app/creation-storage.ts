"use client";

import type { Creation } from "./pixel-data";

const DATABASE_NAME = "pixel-workspace";
const STORE_NAME = "creations";

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1);
    request.onerror = () => reject(request.error ?? new Error("Não foi possível abrir o armazenamento local."));
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
  });
}

export async function loadCreations(): Promise<Creation[]> {
  const database = await openDatabase();
  try {
    return await new Promise<Creation[]>((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
      request.onerror = () => reject(request.error ?? new Error("Não foi possível ler as criações."));
      request.onsuccess = () => resolve(request.result as Creation[]);
    });
  } finally {
    database.close();
  }
}

export async function saveCreations(creations: Creation[]) {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
      creations.forEach((creation) => store.put(creation));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Não foi possível salvar as criações."));
      transaction.onabort = () => reject(transaction.error ?? new Error("Não foi possível salvar as criações."));
    });
  } finally {
    database.close();
  }
}
