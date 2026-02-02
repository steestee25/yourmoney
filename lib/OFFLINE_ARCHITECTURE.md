# Offline-First Architecture per YourMoney

## Panoramica

L'app YourMoney è stata implementata con un'architettura **offline-first** che consente agli utenti di:

1. **Aggiungere/modificare/cancellare transazioni** anche quando offline
2. **Visualizzare le transazioni locali** anche senza connessione a internet
3. **Sincronizzare automaticamente** con Supabase quando torna online
4. **Mantenere coerenza** tra dati locali e remoti

## Componenti Principali

### 1. **Network Status Hook** (`hooks/useNetworkStatus.ts`)
Monitora lo stato della connessione di rete in tempo reale usando `@react-native-community/netinfo`.

```typescript
const { isOnline, isLoading } = useNetworkStatus()
```

**Caratteristiche:**
- Verifica automatica dello stato di rete
- Listener continuo per cambiamenti di connessione
- Fallback sicuro se la rete non è disponibile

### 2. **Database SQLite Locale** (`lib/sqlite.tsx`)
Salva le transazioni localmente usando `expo-sqlite` per un accesso rapido anche offline.

**Tabelle:**
- `offline_transactions`: Memorizza tutte le transazioni con flag `synced`
- `sync_queue`: Coda di operazioni pendenti (create, update, delete)

**Funzioni principali:**
```typescript
initializeDatabase()                    // Inizializza il DB
saveTransactionOffline(transaction)     // Salva una transazione offline
addToSyncQueue(txId, operation, data)   // Aggiunge operazione alla coda
getOfflineTransactions(userId)          // Recupera transazioni offline
getPendingSyncQueue()                   // Ottiene operazioni pendenti
markTransactionAsSynced(txId)           // Marca come sincronizzato
```

### 3. **Transazioni con Supporto Offline** (`lib/transactionsOffline.tsx`)
Wrapper delle funzioni di transazione che gestisce automaticamente online/offline.

```typescript
// Uso automaticamente determina se salvare online o offline
const transaction = await createTransactionWithOfflineSupport(
  userId, name, category, amount, date,
  createTransaction  // funzione online
)
```

**Logica:**
- **Se ONLINE**: Salva direttamente su Supabase + SQLite (cache)
- **Se OFFLINE**: Salva su SQLite + aggiunge a sync queue

### 4. **Sincronizzazione** (`lib/sync.tsx`)
Gestisce la sincronizzazione bidirezionale quando l'utente torna online.

```typescript
const syncResult = await syncWithSupabase(userId)
// { success: boolean, syncedCount: number, failedCount: number, errors: string[] }
```

**Processo di sync:**
1. Recupera la coda di sincronizzazione
2. Processa ogni operazione in ordine (create, update, delete)
3. Aggiorna Supabase
4. Marca operazioni come sincronizzate
5. Rimuove dalla coda

### 5. **Componente UI di Sincronizzazione** (`components/SyncStatus.tsx`)
Mostra visivamente lo stato della sincronizzazione all'utente.

**Stati:**
- 🟢 **Online (sincronizzato)**: Verde con icona cloud-done
- 🟠 **Sincronizzazione in corso**: Arancione con spinner
- 🔴 **Offline**: Rosso con icona cloud-offline

## Flusso di Dati

### Creazione di una Transazione

```
User crea transazione
    ↓
Check rete (checkNetworkState)
    ↓
    ├─ ONLINE ────→ Salva su Supabase → Salva su SQLite
    │
    └─ OFFLINE ───→ Salva su SQLite → Aggiunge a sync_queue
    ↓
Aggiorna UI locale
```

### Sincronizzazione (quando torna online)

```
User torna online
    ↓
Hook useNetworkStatus rileva isOnline = true
    ↓
useEffect in home.tsx triggera syncWithSupabase
    ↓
Legge sync_queue
    ↓
Per ogni operazione pendente:
    ├─ CREATE ───→ POST a Supabase
    ├─ UPDATE ───→ PUT a Supabase
    └─ DELETE ───→ DELETE a Supabase
    ↓
Marca come sincronizzato
    ↓
Ricarica le transazioni da Supabase
    ↓
Aggiorna UI con dati sincronizzati
```

## Gestione degli Errori

### Se Supabase fallisce ma sei online:
- L'operazione viene salvata offline
- Aggiunta a sync_queue con la stessa operazione
- Sarà riprovata quando internet si stabilizza

### Se la sincronizzazione fallisce:
- Errore registrato in console
- Operazione rimane in sync_queue
- Sarà riprovata al prossimo tentativo di sincronizzazione

## Configurazione nel App Root (_layout.tsx)

```typescript
useEffect(() => {
  const init = async () => {
    await initializeDatabase()  // Inizializza SQLite all'avvio
  }
  init()
}, [])
```

## Configurazione in Home (home.tsx)

1. **Import funzioni offline:**
```typescript
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { createTransactionWithOfflineSupport, ... } from '../../lib/transactionsOffline'
import { syncWithSupabase } from '../../lib/sync'
```

2. **Aggiungi hook di rete:**
```typescript
const { isOnline, isLoading: networkLoading } = useNetworkStatus()
const [isSyncing, setIsSyncing] = useState(false)
```

3. **Usa funzioni wrapper:**
```typescript
// Invece di createTransaction, usa:
const savedTransaction = await createTransactionWithOfflineSupport(
  userId, name, category, amount, date,
  createTransaction
)
```

4. **Listener per sincronizzazione automatica:**
```typescript
useEffect(() => {
  if (!isOnline || !session?.user?.id) return
  
  // Sincronizza automaticamente quando torna online
  const syncResult = await syncWithSupabase(session.user.id)
  if (syncResult.success) {
    // Ricarica transazioni
  }
}, [isOnline, session?.user?.id])
```

## Visualizzazione dello Stato

Il componente `SyncStatus` viene aggiunto al layout e mostra:
- Stato di connessione (online/offline)
- Stato di sincronizzazione (sincronizzazione in corso)
- Messaggi informativi

```tsx
<SyncStatus isOnline={isOnline} isSyncing={isSyncing} />
```

## Dipendenze Necessarie

Aggiunte al `package.json`:
```json
{
  "@react-native-community/netinfo": "^11.1.0",
  "expo-sqlite": "~14.0.0"
}
```

## Testing Offline

Per testare la funzionalità offline:

1. **Su simulatore/emulatore:**
   - Usa gli strumenti di rete del simulatore per disabilitare la connessione
   - O usa Airplane Mode

2. **Su dispositivo fisico:**
   - Attiva Airplane Mode
   - L'app continuerà a funzionare normalmente

3. **Verifica della sincronizzazione:**
   - Crea/modifica/cancella una transazione offline
   - Verifica che appaia in `offline_transactions` (DB SQLite)
   - Disattiva Airplane Mode
   - Osserva il SyncStatus che passa a sincronizzazione
   - Verifica che la transazione sia stata sincronizzata su Supabase

## Limiti e Considerazioni

1. **Conflitti di merge:** Se l'utente modifica la stessa transazione su due dispositivi, il merge avviene mantenendo la versione più recente (basata su updated_at)

2. **Dimensione del database locale:** Il database SQLite ha un limite di dimensione (dipende dal dispositivo). Per app con molte transazioni, considerare la pulizia periodica

3. **Timeout di sincronizzazione:** Se la sincronizzazione richiede troppo tempo, considerare implementare un timeout

4. **Notifiche di sincronizzazione:** Attualmente visual feedback è minimale. Per migliore UX, si potrebbe aggiungere:
   - Toast notifications
   - Suono di notifica per sincronizzazione completata
   - History delle sincronizzazioni fallite

## Prossimi Miglioramenti

- [ ] Implementare retry automatico con backoff esponenziale
- [ ] Aggiungere toast notifications per feedback visivo
- [ ] Implementare delta sync (sincronizza solo le differenze)
- [ ] Aggiungere compressione dei dati offline
- [ ] Implementare encryption dei dati sensibili nel DB locale
- [ ] Dashboard di debug per lo stato di sincronizzazione
