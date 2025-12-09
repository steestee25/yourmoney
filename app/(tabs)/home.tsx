import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import TransactionModal from "../../components/TransactionModal";
import { styles } from "../../styles/home.styles";

import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { createTransaction, fetchUserTransactions, groupTransactionsByDay } from '../../lib/transactions';

import { COLORS } from '../../constants/color';

export default function Index() {

  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Form states (for update)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingDayId, setEditingDayId] = useState(null);

  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [expenseData, setExpenseData] = useState([]);

  const { session } = useAuth()

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.log('Error fetching profile:', error.message || error);
          return;
        }

        setProfile(data || null);
        console.log('Profile from DB:', data);
      } catch (err) {
        console.log('Unexpected error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [session]);

  // Fetch delle transazioni al mount
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchTransactions = async () => {
      setIsLoadingTransactions(true);
      try {
        const transactions = await fetchUserTransactions(session.user.id);
        const categoryIcons = {
          'Clothing': '👕',
          'Electronics': '📱',
          'Car': '🚗',
          'Groceries': '🛒',
          'Entertainment': '🎬',
          'Food & Drink': '☕',
          'Shopping': '📦',
          'Health & Fitness': '💪',
          'Medicines': '💊',
          'Travel': '✈️',
          'Bills': '🧾',
          'Dentist': '🦷',
          'Education': '🎓',
          'Pets': '🐾',
          'Gifts': '🎁',
          'Medical Visits': '🏥',
          'Phone': '📞',
          'Extras': '🛍️',
          'Restaurant': '🍽️',
          'Public Transport': '🚌',
        };
        const categoryColors = {
          'Clothing': '#4285F4',
          'Electronics': '#34A853',
          'Car': '#FBBC04',
          'Groceries': '#EA4335',
          'Entertainment': '#9333EA',
          'Food & Drink': '#10B981',
          'Shopping': '#FF6B35',
          'Health & Fitness': '#8B5CF6',
          'Medicines': '#F44336',
          'Travel': '#00B8D9',
          'Bills': '#FFAB00',
          'Dentist': '#00C853',
          'Education': '#1976D2',
          'Pets': '#FF8A65',
          'Gifts': '#C51162',
          'Medical Visits': '#009688',
          'Phone': '#607D8B',
          'Extras': '#7C4DFF',
          'Restaurant': '#FF7043',
          'Public Transport': '#388E3C',
        };
        const grouped = groupTransactionsByDay(transactions, categoryIcons, categoryColors);
        setExpenseData(grouped);
      } catch (err) {
        console.error('Errore nel fetch delle transazioni:', err);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [session?.user?.id]);

  // Stampa dati specifici dell'utente per debug (opzionale, puoi rimuovere)
  console.log('User ID:', session?.user?.id)
  console.log('Email:', session?.user?.email)

  const data = [
    { value: 50, label: 'Feb', frontColor: '#8fe8e7ff' },
    { value: 90, label: 'Mar', frontColor: '#78ebe9ff' },
    { value: 70, label: 'Apr', frontColor: '#8fe8e7ff' },
    { value: 70, label: 'May', frontColor: '#78ebe9ff' },
    { value: 100, label: 'Jun', frontColor: '#8fe8e7ff' },
    { value: 85, label: 'Jul', frontColor: '#00ECEC' },
  ].map((item, index) => ({
    ...item,
    frontColor: selectedIndex === index ? '#ffffff' : item.frontColor,
  }));

  const categoryColors = {
    'Clothing': '#4285F4',
    'Electronics': '#34A853',
    'Car': '#FBBC04',
    'Groceries': '#EA4335',
    'Entertainment': '#9333EA',
    'Food & Drink': '#10B981',
    'Shopping': '#FF6B35',
    'Health & Fitness': '#8B5CF6',
    'Medicines': '#F44336',
    'Travel': '#00B8D9',
    'Bills': '#FFAB00',
    'Dentist': '#00C853',
    'Education': '#1976D2',
    'Pets': '#FF8A65',
    'Gifts': '#C51162',
    'Medical Visits': '#009688',
    'Phone': '#607D8B',
    'Extras': '#7C4DFF',
    'Restaurant': '#FF7043',
    'Public Transport': '#388E3C',
  };

  const categoryIcons = {
    'Clothing': '👕',
    'Electronics': '📱',
    'Car': '🚗',
    'Groceries': '🛒',
    'Entertainment': '🎬',
    'Food & Drink': '☕',
    'Shopping': '📦',
    'Health & Fitness': '💪',
    'Medicines': '💊',
    'Travel': '✈️',
    'Bills': '🧾',
    'Dentist': '🦷',
    'Education': '🎓',
    'Pets': '🐾',
    'Gifts': '🎁',
    'Medical Visits': '🏥',
    'Phone': '📞',
    'Extras': '🛍️',
    'Restaurant': '🍽️',
    'Public Transport': '🚌',
  }

  // Always sort days descending after updates
  const sortDaysDescending = (days) =>
    [...days].sort((a, b) => b.id - a.id);

  // ADD transaction
  const handleAddTransaction = async (newTransaction) => {
    if (!session?.user?.id) {
      console.error('User ID not available');
      return;
    }

    try {
      // Salva nel DB
      const savedTransaction = await createTransaction(
        session.user.id,
        newTransaction.name,
        newTransaction.category,
        newTransaction.amount,
        newTransaction.date
      );

      if (!savedTransaction) {
        console.error('Errore nel salvataggio della transazione');
        return;
      }

      // Aggiorna lo stato locale
      const dayTimestamp = new Date(newTransaction.date);
      dayTimestamp.setHours(0, 0, 0, 0);
      const dayId = dayTimestamp.getTime();

      const categoryIcons = {
        'Clothing': '👕', 'Electronics': '📱', 'Car': '🚗', 'Groceries': '🛒',
        'Entertainment': '🎬', 'Food & Drink': '☕', 'Shopping': '📦',
        'Health & Fitness': '💪', 'Medicines': '💊', 'Travel': '✈️',
        'Bills': '🧾', 'Dentist': '🦷', 'Education': '🎓', 'Pets': '🐾',
        'Gifts': '🎁', 'Medical Visits': '🏥', 'Phone': '📞', 'Extras': '🛍️',
        'Restaurant': '🍽️', 'Public Transport': '🚌',
      };
      const categoryColors = {
        'Clothing': '#4285F4', 'Electronics': '#34A853', 'Car': '#FBBC04',
        'Groceries': '#EA4335', 'Entertainment': '#9333EA', 'Food & Drink': '#10B981',
        'Shopping': '#FF6B35', 'Health & Fitness': '#8B5CF6', 'Medicines': '#F44336',
        'Travel': '#00B8D9', 'Bills': '#FFAB00', 'Dentist': '#00C853',
        'Education': '#1976D2', 'Pets': '#FF8A65', 'Gifts': '#C51162',
        'Medical Visits': '#009688', 'Phone': '#607D8B', 'Extras': '#7C4DFF',
        'Restaurant': '#FF7043', 'Public Transport': '#388E3C',
      };

      const transactionWithUI = {
        ...savedTransaction,
        icon: categoryIcons[savedTransaction.category] || '💰',
        color: categoryColors[savedTransaction.category] || '#999999',
      };

      setExpenseData((prev) => {
        const existingDayIndex = prev.findIndex((day) => day.id === dayId);
        let updatedDays = [...prev];

        if (existingDayIndex >= 0) {
          updatedDays[existingDayIndex].transactions.unshift(transactionWithUI);
        } else {
          updatedDays.push({
            id: dayId,
            transactions: [transactionWithUI],
          });
        }

        return sortDaysDescending(updatedDays);
      });

      setModalVisible(false);
    } catch (err) {
      console.error('Errore in handleAddTransaction:', err);
    }
  };

  // EDIT transaction
  const handleEditTransaction = (updatedTransaction) => {
    const dayTimestamp = new Date(updatedTransaction.date);
    dayTimestamp.setHours(0, 0, 0, 0);
    const newDayId = dayTimestamp.getTime();

    setExpenseData((prev) => {
      let updatedDays = [...prev];

      // Find old transaction
      let oldDayIndex = -1;
      let transactionIndex = -1;

      updatedDays.forEach((day, dIndex) => {
        const tIndex = day.transactions.findIndex(
          (t) => t.id === updatedTransaction.id
        );
        if (tIndex !== -1) {
          oldDayIndex = dIndex;
          transactionIndex = tIndex;
        }
      });

      if (oldDayIndex === -1 || transactionIndex === -1) {
        return prev; // Not found
      }

      // Same day → just replace
      if (updatedDays[oldDayIndex].id === newDayId) {
        updatedDays[oldDayIndex].transactions[transactionIndex] =
          updatedTransaction;
        return sortDaysDescending(updatedDays);
      }

      // Date changed → remove from old day
      updatedDays[oldDayIndex].transactions.splice(transactionIndex, 1);
      if (updatedDays[oldDayIndex].transactions.length === 0) {
        updatedDays.splice(oldDayIndex, 1);
      }

      // Add to new day
      const newDayIndex = updatedDays.findIndex((d) => d.id === newDayId);
      if (newDayIndex !== -1) {
        updatedDays[newDayIndex].transactions.unshift(updatedTransaction);
      } else {
        updatedDays.push({
          id: newDayId,
          transactions: [updatedTransaction],
        });
      }

      return sortDaysDescending(updatedDays);
    });

    setEditModalVisible(false);
  };

  const handleBarPress = (item, index) => {
    if (selectedIndex === index) {
      // Se la stessa barra è cliccata, deseleziona
      setSelectedValue(null);
      setSelectedIndex(null);
    } else {
      // Seleziona nuova barra
      setSelectedValue(item.value);
      setSelectedIndex(index);
    }
  };

  const renderTransactionItem = ({ item: transaction, dayId }) => (
    <TouchableOpacity
      onPress={() => {
        setEditingTransaction({ ...transaction, date: transaction.date || Number(dayId) });
        setEditingDayId(dayId);
        setEditModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View style={[styles.transactionIcon, { backgroundColor: transaction.color + '20' }]}>
            <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
          </View>
          <View>
            <Text style={styles.transactionName}>{transaction.name}</Text>
            <Text style={styles.transactionCategory}>{transaction.category}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>−€{Math.abs(transaction.amount).toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDaySection = ({ item: day }) => {
    const date = new Date(Number(day.id));

    // Convert timestamp string → Date → formatted string
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // Get today's date (without time)
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return (
      <View style={styles.daySection}>
        <Text style={styles.dayHeader}>{isToday ? 'Today' : formattedDate}</Text>
        {day.transactions.map((transaction) => (
          <View key={transaction.id}>
            {renderTransactionItem({ item: transaction, dayId: day.id })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.containerHeader}>
        <Text style={styles.textHelloMessage}>
          Hello, <Text style={{ fontWeight: "bold" }}>{profile?.full_name || session?.user?.user_metadata?.full_name}</Text>
        </Text>

        <View style={styles.iconSearch}>
          <Ionicons name="search-outline" size={26} color="#333" />
        </View>
      </View>

      <View style={styles.recapContainer}>
        <View style={styles.recapCard}>
          <View style={styles.recapCardExpensesContainer}>
            {(
              <Text style={styles.selectedValueText}>
                {selectedValue ? `Expenses: ${selectedValue}€` : 'Expenses'}
              </Text>)}
          </View>
          <BarChart data={data} barBorderRadius={4} yAxisThickness={0} xAxisThickness={0} hideRules={true}
            hideYAxisText={true} noOfSections={1} height={150} xAxisLabelTextStyle={{ color: COLORS.white, fontWeight: 'bold' }} initialSpacing={10} onPress={handleBarPress} />
        </View>
      </View>

      <View style={styles.transactionsContainer}>
        <FlatList
          data={expenseData}
          renderItem={renderDaySection}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        {/* Add Transaction Modal */}
        <TransactionModal
          visible={modalVisible}
          mode="add"
          onCancel={() => setModalVisible(false)}
          onSave={handleAddTransaction}
          categoryIcons={categoryIcons}
          categoryColors={categoryColors}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        {/* Edit Transaction Modal */}
        <TransactionModal
          visible={editModalVisible}
          mode="edit"
          transaction={editingTransaction}
          onCancel={() => setEditModalVisible(false)}
          onSave={handleEditTransaction}
          categoryIcons={categoryIcons}
          categoryColors={categoryColors}
        />
      </View>

      {/* FAB Button */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        {/* FAB Assistente AI */}
        <View style={[styles.fabButtonSmall, { marginBottom: 15 }]}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color={COLORS.white} />
        </View>
        {/* FAB Add */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setModalVisible(true)}
        >
          <Text>
            <Ionicons name="add" size={32} color={COLORS.white} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}