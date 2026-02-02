import * as SQLite from 'expo-sqlite';
import { DBTransaction } from './transactions';

const DATABASE_NAME = 'yourmoney.db';
const TRANSACTIONS_TABLE = 'offline_transactions';
const SYNC_QUEUE_TABLE = 'sync_queue';

/**
 * Inizializza il database SQLite
 */
export const initializeDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    // Crea la tabella per le transazioni offline
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TRANSACTIONS_TABLE} (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);

    // Crea la tabella per la coda di sincronizzazione
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${SYNC_QUEUE_TABLE} (
        id TEXT PRIMARY KEY,
        transaction_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);

    console.log('✓ Database SQLite inizializzato');
    return db;
  } catch (err) {
    console.error('Errore nell\'inizializzazione del database:', err);
    throw err;
  }
};

/**
 * Ottiene l'istanza del database
 */
export const getDatabase = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};

/**
 * Salva una transazione in SQLite (offline)
 */
export const saveTransactionOffline = async (
  transaction: DBTransaction
): Promise<boolean> => {
  try {
    const db = await getDatabase();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT OR REPLACE INTO ${TRANSACTIONS_TABLE}
       (id, user_id, name, category, amount, date, created_at, updated_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        transaction.id,
        transaction.user_id,
        transaction.name,
        transaction.category,
        transaction.amount,
        transaction.date,
        transaction.created_at,
        transaction.updated_at,
      ]
    );

    console.log('✓ Transazione salvata offline:', transaction.id);
    return true;
  } catch (err) {
    console.error('Errore nel salvataggio offline:', err);
    return false;
  }
};

/**
 * Aggiunge un'operazione alla coda di sincronizzazione
 */
export const addToSyncQueue = async (
  transactionId: string,
  operation: 'create' | 'update' | 'delete',
  transactionData: any
): Promise<boolean> => {
  try {
    const db = await getDatabase();
    const queueId = `sync_${Date.now()}_${Math.random()}`;
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO ${SYNC_QUEUE_TABLE}
       (id, transaction_id, operation, data, created_at, synced)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [
        queueId,
        transactionId,
        operation,
        JSON.stringify(transactionData),
        now,
      ]
    );

    console.log(`✓ Operazione aggiunta a sync queue: ${operation} per ${transactionId}`);
    return true;
  } catch (err) {
    console.error('Errore nell\'aggiunta alla sync queue:', err);
    return false;
  }
};

/**
 * Recupera tutte le transazioni salvate offline
 */
export const getOfflineTransactions = async (userId: string): Promise<DBTransaction[]> => {
  try {
    const db = await getDatabase();
    const result = await db.getAllAsync<DBTransaction>(
      `SELECT * FROM ${TRANSACTIONS_TABLE} WHERE user_id = ? ORDER BY date DESC`,
      [userId]
    );

    console.log(`✓ Recuperate ${result.length} transazioni offline`);
    return result || [];
  } catch (err) {
    console.error('Errore nel recupero transazioni offline:', err);
    return [];
  }
};

/**
 * Recupera la coda di sincronizzazione non sincronizzata
 */
export const getPendingSyncQueue = async (): Promise<any[]> => {
  try {
    const db = await getDatabase();
    const result = await db.getAllAsync(
      `SELECT * FROM ${SYNC_QUEUE_TABLE} WHERE synced = 0 ORDER BY created_at ASC`
    );

    console.log(`✓ Recuperate ${result.length} operazioni pendenti da sincronizzare`);
    return result || [];
  } catch (err) {
    console.error('Errore nel recupero della sync queue:', err);
    return [];
  }
};

/**
 * Marca una transazione come sincronizzata
 */
export const markTransactionAsSynced = async (transactionId: string): Promise<boolean> => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE ${TRANSACTIONS_TABLE} SET synced = 1 WHERE id = ?`,
      [transactionId]
    );

    console.log('✓ Transazione marcata come sincronizzata:', transactionId);
    return true;
  } catch (err) {
    console.error('Errore nel marcatura di sincronizzazione:', err);
    return false;
  }
};

/**
 * Marca un'operazione di sync queue come completata
 */
export const markSyncQueueItemAsSynced = async (queueItemId: string): Promise<boolean> => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE ${SYNC_QUEUE_TABLE} SET synced = 1 WHERE id = ?`,
      [queueItemId]
    );

    console.log('✓ Sync queue item marcato come sincronizzato:', queueItemId);
    return true;
  } catch (err) {
    console.error('Errore nel marcatura sync queue:', err);
    return false;
  }
};

/**
 * Elimina una transazione dal database locale
 */
export const deleteTransactionOffline = async (transactionId: string): Promise<boolean> => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `DELETE FROM ${TRANSACTIONS_TABLE} WHERE id = ?`,
      [transactionId]
    );

    console.log('✓ Transazione eliminata dal database offline:', transactionId);
    return true;
  } catch (err) {
    console.error('Errore nella cancellazione offline:', err);
    return false;
  }
};

/**
 * Cancella la coda di sincronizzazione per una transazione
 */
export const clearSyncQueueForTransaction = async (transactionId: string): Promise<boolean> => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `DELETE FROM ${SYNC_QUEUE_TABLE} WHERE transaction_id = ?`,
      [transactionId]
    );

    console.log('✓ Sync queue pulita per transazione:', transactionId);
    return true;
  } catch (err) {
    console.error('Errore nella pulizia della sync queue:', err);
    return false;
  }
};
