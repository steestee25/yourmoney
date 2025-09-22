import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function Index() {

  const [selectedValue, setSelectedValue] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(null);

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

  // Mappatura colori per categoria
  const categoryColors = {
    'Clothing': '#4285F4',
    'Electronics': '#34A853', 
    'Transport': '#FBBC04',
    'Groceries': '#EA4335',
    'Entertainment': '#9333EA',
    'Food & Drink': '#10B981',
    'Shopping': '#FF6B35',
    'Health & Fitness': '#8B5CF6'
  };

  const categoryIcons = {
    'Clothing': '👕',
    'Electronics': '📱',
    'Transport': '🚗',
    'Groceries': '🛒',
    'Entertainment': '🎬',
    'Food & Drink': '☕',
    'Shopping': '📦',
    'Health & Fitness': '💪',
  }

  const expenseData = [
    {
      id: '1',
      date: 'Today',
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
      id: '2',  
      date: '08 April',
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
          category: 'Transport',
          amount: -4.99,
          tax: 0.80,
          icon: categoryIcons['Transport'],
          color: categoryColors['Transport']
        }
      ]
    },
    {
      id: '3',
      date: '07 April',
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
    {
      id: '4',
      date: '06 April',
      transactions: [
        {
          id: 't6',
          name: 'Starbucks',
          category: 'Food & Drink',
          amount: -12.75,
          tax: 1.90,
          icon: categoryIcons['Food & Drink'],
          color: categoryColors['Food & Drink']
        },
        {
          id: 't7',
          name: 'Gas Station',
          category: 'Transport',
          amount: -65.00,
          tax: 5.20,
          icon: categoryIcons['Transport'],
          color: categoryColors['Transport']
        }
      ]
    },
    {
      id: '5',
      date: '05 April',
      transactions: [
        {
          id: 't8',
          name: 'Amazon',
          category: 'Shopping',
          amount: -43.20,
          tax: 3.85,
          icon: categoryIcons['Shopping'],
          color: categoryColors['Shopping']
        },
        {
          id: 't9',
          name: 'Gym Membership',
          category: 'Health & Fitness',
          amount: -45.00,
          tax: 0.00,
          icon: categoryIcons['Health & Fitness'],
          color: categoryColors['Health & Fitness']
        }
      ]
    }
  ];

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

  const renderDaySection = ({ item: day }) => (
    <View style={styles.daySection}>
      <Text style={styles.dayHeader}>{day.date}</Text>
      {day.transactions.map((transaction) => (
        <View key={transaction.id}>
          {renderTransactionItem({ item: transaction })}
        </View>
      ))}
    </View>
  );

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

      {/* FAB Button */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        {/* FAB Assistente AI */}
        <View style={[styles.fabButtonSmall, { marginBottom: 15 }]}> 
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#fff" />
        </View>
        {/* FAB Add */}
        <View style={styles.fabButton}>
          <Ionicons name="add" size={32} color="#fff" />
        </View>
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
});
