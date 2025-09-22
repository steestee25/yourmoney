import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function Index() {

  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Form states
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Clothing");
  const [newAmount, setNewAmount] = useState("");

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

  // Function to add transaction
  const handleAddTransaction = () => {
    if (!newName || !newAmount) return;

    const newTransaction = {
      id: Date.now(),
      name: newName,
      category: newCategory,
      amount: -parseFloat(newAmount),
      icon: categoryIcons[newCategory],
      color: categoryColors[newCategory],
    };

    //console.log(newTransaction);
    //const date = new Date(newTransaction['id']);    // Create Date object

    //console.log(date.toString());        // Full readable date
    //console.log(date.toLocaleString());  // Local date & time
    //console.log(date.toLocaleDateString()); // Local date only

    const todayTimestamp = new Date();
    todayTimestamp.setHours(0, 0, 0, 0); // Reset time to midnight
    const todayId = todayTimestamp.getTime();

    setExpenseData((prev) => {
      // Check if today's entry exists
      const existingDayIndex = prev.findIndex(day => day.id === todayId);

      if (existingDayIndex >= 0) {
        // Add transaction to existing day
        const updated = [...prev];
        updated[existingDayIndex].transactions.unshift(newTransaction);
        return updated;
      } else {
        // Create new day entry
        return [
          {
            id: todayId,
            transactions: [newTransaction],
          },
          ...prev,
        ];
      }
    });


    // Reset + close modal
    setNewName("");
    setNewAmount("");
    setNewCategory("Clothing");
    setModalVisible(false);
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

  // Calcolo del totale delle spese
  const totalOutcome = expenseData.reduce((total, day) => {
    return total + day.transactions.reduce((dayTotal, transaction) => {
      return dayTotal + Math.abs(transaction.amount);
    }, 0);
  }, 0);


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

  const renderTransactionItem = ({ item: transaction }) => (
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
            {renderTransactionItem({ item: transaction })}
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
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Transaction</Text>

              <TextInput
                style={styles.input}
                placeholder="Transaction Name"
                value={newName}
                onChangeText={setNewName}
              />

              {/* Category Picker */}
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <FlatList
                  data={Object.keys(categoryIcons)}
                  horizontal
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.categoryChip,
                        newCategory === item && {
                          backgroundColor: categoryColors[item] + 45,
                          borderColor: categoryColors[item] + 90
                        },
                      ]}
                      onPress={() => setNewCategory(item)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          newCategory === item && styles.categoryChipTextSelected,
                        ]}
                      >
                        {categoryIcons[item]} {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Amount (€)"
                value={newAmount}
                onChangeText={setNewAmount}
                keyboardType="numeric"
              />

              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalCancelCompact} onPress={() => setModalVisible(false)} activeOpacity={0.7}>
                  <Text style={styles.modalCancelCompactText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalAddCompact} onPress={handleAddTransaction} activeOpacity={0.7}>
                  <Text style={styles.modalAddCompactText}>Add</Text>
                </TouchableOpacity>

              </View>

            </View>
          </View>
        </Modal>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerHeader: {
    marginTop: '10%',
    marginLeft: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textHelloMessage: {
    fontSize: 34,
    color: "#333",
  },
  iconSearch: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#f0f0f0eb',
  },
  recapContainer: {
    flex: 0.4,
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  recapCard: {
    flex: 1,
    backgroundColor: '#9CF1F0',
    borderRadius: 35,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recapCardExpensesContainer: {
    left: '5%',
    marginBottom: '10%',
  },
  selectedValueText: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: -5,
  },
  transactionsContainer: {
    flex: 0.6,
    marginTop: '5%',
    paddingHorizontal: '5%',
    marginBottom: '15%',
  },
  daySection: {
    marginBottom: 25,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B5F5F',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 0.6,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#888',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    zIndex: 100,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    pointerEvents: 'box-none',
  },

  fabButtonSmall: {
    backgroundColor: '#d4c3faff',
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginRight: 6,
  },

  fabButton: {
    backgroundColor: '#00ECEC',
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#333",
  },
  categoryChipTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#00ECEC",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  modalAddCompact: {
    flex: 1,
    backgroundColor: '#00ECEC',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#00ECEC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },

  modalAddCompactText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  modalCancelCompact: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  modalCancelCompactText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },

});
