import { supabase } from './supabase';

// Tipo per una transazione dal DB
export interface DBTransaction {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}

// Tipo per una transazione locale (con icon e color)
export interface LocalTransaction extends DBTransaction {
  icon: string;
  color: string;
}

/**
 * Fetch le ultime 30 transazioni dell'utente dal DB
 * Ordinate per data decrescente (più recenti prima)
 */
export const fetchUserTransactions = async (userId: string): Promise<DBTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Errore nel fetch transazioni:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Errore inaspettato nel fetch transazioni:', err);
    return [];
  }
};

/**
 * Inserisce una nuova transazione nel DB
 */
export const createTransaction = async (
  userId: string,
  name: string,
  category: string,
  amount: number,
  date: Date
): Promise<DBTransaction | null> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          name,
          category,
          amount,
          date: date.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Errore nel create transazione:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Errore inaspettato nel create transazione:', err);
    return null;
  }
};

/**
 * Aggiorna una transazione nel DB
 */
export const updateTransaction = async (
  transactionId: string,
  updates: {
    name?: string;
    category?: string;
    amount?: number;
    date?: Date;
  }
): Promise<DBTransaction | null> => {
  try {
    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = updates.date.toISOString();
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      console.error('Errore nell\'update transazione:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Errore inaspettato nell\'update transazione:', err);
    return null;
  }
};

/**
 * Cancella una transazione dal DB
 */
export const deleteTransaction = async (transactionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) {
      console.error('Errore nella delete transazione:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Errore inaspettato nella delete transazione:', err);
    return false;
  }
};

/**
 * Raggruppa transazioni per giorno e aggiunge icon/color
 * Distingue tra income (amount > 0) e expense (amount < 0)
 */
export const groupTransactionsByDay = (
  transactions: DBTransaction[],
  categoryIcons: Record<string, string>,
  categoryColors: Record<string, string>,
  incomeCategoryIcons?: Record<string, string>,
  incomeCategoryColors?: Record<string, string>
) => {
  const grouped: Record<number, LocalTransaction[]> = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    date.setHours(0, 0, 0, 0);
    const dayId = date.getTime();

    if (!grouped[dayId]) {
      grouped[dayId] = [];
    }

    // Scegli le mappe corrette in base al segno dell'amount
    const isIncome = transaction.amount > 0;
    const icons = isIncome && incomeCategoryIcons ? incomeCategoryIcons : categoryIcons;
    const colors = isIncome && incomeCategoryColors ? incomeCategoryColors : categoryColors;

    grouped[dayId].push({
      ...transaction,
      icon: icons[transaction.category] || '💰',
      color: colors[transaction.category] || '#999999',
    });
  });

  // Converti in array e ordina per giorno decrescente
  return Object.entries(grouped)
    .map(([dayId, transactionsList]) => ({
      id: Number(dayId),
      // Ordina transazioni dentro il giorno per created_at decrescente (più recenti prima)
      transactions: transactionsList.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    }))
    .sort((a, b) => b.id - a.id);
};

/**
 * Calcola le spese aggregate per mese degli ultimi 6 mesi
 * Restituisce array ordinato da più vecchio a più recente
 */
export const fetchExpensesByMonth = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, date')
      .eq('user_id', userId)
      .lt('amount', 0); // Solo expense (amount negativo)

    if (error) {
      console.error('Errore nel fetch spese per mese:', error.message);
      return [];
    }

    // Calcola ultimi 6 mesi
    const monthsData: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthsData[monthKey] = 0;
    }

    // Aggrega le spese per mese
    (data || []).forEach((transaction) => {
      const txDate = new Date(transaction.date);
      const monthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthsData.hasOwnProperty(monthKey)) {
        monthsData[monthKey] += Math.abs(transaction.amount); // Converti a positivo
      }
    });

    // Converti in array con label mese
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Object.entries(monthsData).map(([monthKey, total]) => {
      const [year, month] = monthKey.split('-');
      const monthIndex = parseInt(month) - 1;
      return {
        value: Math.round(total),
        label: monthLabels[monthIndex],
      };
    });
  } catch (err) {
    console.error('Errore inaspettato nel fetch spese per mese:', err);
    return [];
  }
};

/**
 * Calcola gli income aggregati per mese degli ultimi 6 mesi
 * Restituisce array ordinato da più vecchio a più recente
 */
export const fetchIncomeByMonth = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, date')
      .eq('user_id', userId)
      .gt('amount', 0); // Solo income (amount positivo)

    if (error) {
      console.error('Errore nel fetch income per mese:', error.message);
      return [];
    }

    // Calcola ultimi 6 mesi
    const monthsData: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthsData[monthKey] = 0;
    }

    // Aggrega gli income per mese
    (data || []).forEach((transaction) => {
      const txDate = new Date(transaction.date);
      const monthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthsData.hasOwnProperty(monthKey)) {
        monthsData[monthKey] += transaction.amount; // Già positivo
      }
    });

    // Converti in array con label mese
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Object.entries(monthsData).map(([monthKey, total]) => {
      const [year, month] = monthKey.split('-');
      const monthIndex = parseInt(month) - 1;
      return {
        value: Math.round(total),
        label: monthLabels[monthIndex],
      };
    });
  } catch (err) {
    console.error('Errore inaspettato nel fetch income per mese:', err);
    return [];
  }
};

/**
 * Fetch total expenses for the previous calendar month grouped by category
 * Returns array of { category, total } ordered by total desc
 */
export const fetchExpensesByCategoryLastMonth = async (userId: string) => {
  try {
    const today = new Date();
    // Start of previous month
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(startOfThisMonth.getTime());

    const { data, error } = await supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', userId)
      .gte('date', startOfLastMonth.toISOString())
      .lt('date', endOfLastMonth.toISOString())
      .lt('amount', 0);

    if (error) {
      console.error('Errore nel fetch spese per categoria ultimo mese:', error.message);
      return [];
    }

    const totals: Record<string, number> = {};
    (data || []).forEach((tx: any) => {
      const cat = tx.category || 'Other';
      totals[cat] = (totals[cat] || 0) + Math.abs(tx.amount);
    });

    return Object.entries(totals)
      .map(([category, total]) => ({ category, total: Math.round(total) }))
      .sort((a, b) => b.total - a.total);
  } catch (err) {
    console.error('Errore inaspettato nel fetch spese per categoria:', err);
    return [];
  }
};
