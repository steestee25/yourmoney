import {
    deleteTransactionOffline,
    getPendingSyncQueue,
    removeSyncQueueItem,
} from './offlineStorage';
import { supabase } from './supabase';

/**
 * Sincronizza tutte le operazioni pendenti con Supabase
 */
export const syncWithSupabase = async (userId: string): Promise<{
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: string[];
}> => {
  const errors: string[] = [];
  let syncedCount = 0;
  let failedCount = 0;

  try {
    console.log('🔄 Avvio sincronizzazione con Supabase...');

    const pendingQueue = await getPendingSyncQueue();

    if (pendingQueue.length === 0) {
      console.log('✓ Nessuna operazione da sincronizzare');
      return { success: true, syncedCount: 0, failedCount: 0, errors: [] };
    }

    for (const queueItem of pendingQueue) {
      try {
        const operation = queueItem.operation as 'create' | 'update' | 'delete';
        const transactionData = queueItem.data;

        console.log(`📤 Sincronizzando: ${operation} per ${queueItem.transactionId}`);

        let syncSuccess = false;

        switch (operation) {
          case 'create':
            syncSuccess = await syncCreateTransaction(queueItem.transactionId, transactionData);
            break;
          case 'update':
            syncSuccess = await syncUpdateTransaction(queueItem.transactionId, transactionData);
            break;
          case 'delete':
            syncSuccess = await syncDeleteTransaction(queueItem.transactionId);
            break;
        }

        if (syncSuccess) {
          await removeSyncQueueItem(queueItem.id);

          if (operation === 'delete') {
            await deleteTransactionOffline(queueItem.transactionId);
          }

          syncedCount++;
          console.log(`✓ ${operation} sincronizzato: ${queueItem.transactionId}`);
        } else {
          failedCount++;
          const errorMsg = `Sync fallito per ${operation}: ${queueItem.transactionId}`;
          errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      } catch (err: any) {
        failedCount++;
        const errorMsg = `Errore durante sincronizzazione: ${err.message}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    const result = {
      success: failedCount === 0,
      syncedCount,
      failedCount,
      errors,
    };

    console.log(`✓ Sincronizzazione completata: ${syncedCount} successi, ${failedCount} fallimenti`);
    return result;
  } catch (err: any) {
    const errorMsg = `Errore generale nella sincronizzazione: ${err.message}`;
    errors.push(errorMsg);
    console.error(errorMsg);
    return { success: false, syncedCount, failedCount, errors };
  }
};

/**
 * Sincronizza la creazione di una transazione
 */
const syncCreateTransaction = async (
  transactionId: string,
  transactionData: any
): Promise<boolean> => {
  try {
    const { data: existing } = await supabase
      .from('transactions')
      .select('id')
      .eq('id', transactionId)
      .single();

    if (existing) {
      console.log(`ℹ️  Transazione ${transactionId} esiste già`);
      return true;
    }

    const { error } = await supabase
      .from('transactions')
      .insert([transactionData]);

    if (error) {
      console.error(`Errore nell'inserimento:`, error);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error(`Errore nella sincronizzazione create:`, err);
    return false;
  }
};

/**
 * Sincronizza l'aggiornamento di una transazione
 */
const syncUpdateTransaction = async (
  transactionId: string,
  transactionData: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .update(transactionData)
      .eq('id', transactionId);

    if (error) {
      console.error(`Errore nell'aggiornamento:`, error);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error(`Errore nella sincronizzazione update:`, err);
    return false;
  }
};

/**
 * Sincronizza la cancellazione di una transazione
 */
const syncDeleteTransaction = async (transactionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) {
      console.error(`Errore nella cancellazione:`, error);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error(`Errore nella sincronizzazione delete:`, err);
    return false;
  }
};
