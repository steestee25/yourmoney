import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import TransactionModal from "../../components/TransactionModal";
import { styles } from "../../styles/index.styles";

export default function Index() {

  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Form states (for update)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingDayId, setEditingDayId] = useState(null);

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
  const handleAddTransaction = (newTransaction) => {
    const dayTimestamp = new Date(newTransaction.date);
    dayTimestamp.setHours(0, 0, 0, 0);
    const dayId = dayTimestamp.getTime();

    newTransaction.id = Date.now().toString();

    setExpenseData((prev) => {
      const existingDayIndex = prev.findIndex((day) => day.id === dayId);
      let updatedDays = [...prev];

      if (existingDayIndex >= 0) {
        updatedDays[existingDayIndex].transactions.unshift(newTransaction);
      } else {
        updatedDays.push({
          id: dayId,
          transactions: [newTransaction],
        });
      }

      return sortDaysDescending(updatedDays);
    });

    setModalVisible(false);
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

  const [expenseData, setExpenseData] = useState([{
    id: new Date('2025-09-22').setHours(0, 0, 0, 0),
    transactions: [
      {
        id: 't1',
        name: 'Nike Store',
        category: 'Clothing',
        amount: -734.00,
        tax: 60.35,
        icon: categoryIcons['Clothing'],
        color: categoryColors['Clothing']
      }
    ]
  },
  {
    id: new Date('2025-09-10').setHours(0, 0, 0, 0),
    transactions: [
      {
        id: 't2',
        name: 'Apple Store',
        category: 'Electronics',
        amount: -25.00,
        tax: 4.50,
        icon: categoryIcons['Electronics'],
        color: categoryColors['Electronics']
      },
      {
        id: 't3',
        name: 'Uber',
        category: 'Car',
        amount: -4.99,
        tax: 0.80,
        icon: categoryIcons['Car'],
        color: categoryColors['Car']
      }
    ]
  },
  {
    id: new Date('2025-09-5').setHours(0, 0, 0, 0),
    transactions: [
      {
        id: 't4',
        name: 'Supermarket',
        category: 'Groceries',
        amount: -87.50,
        tax: 7.25,
        icon: categoryIcons['Groceries'],
        color: categoryColors['Groceries']
      },
      {
        id: 't5',
        name: 'Netflix',
        category: 'Entertainment',
        amount: -15.99,
        tax: 2.40,
        icon: categoryIcons['Entertainment'],
        color: categoryColors['Entertainment']
      }
    ]
  },
  ]);

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
        setEditingTransaction({ ...transaction, date: transaction.date || Number(dayId)});
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
          Hello, <Text style={{ fontWeight: "bold" }}>Stefano</Text>
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
            hideYAxisText={true} noOfSections={1} height={150} xAxisLabelTextStyle={{ color: '#ffffff', fontWeight: 'bold' }} initialSpacing={10} onPress={handleBarPress} />
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
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#fff" />
        </View>
        {/* FAB Add */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setModalVisible(true)}
        >
          <Text>
            <Ionicons name="add" size={32} color="#fff" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}