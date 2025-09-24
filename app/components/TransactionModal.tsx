// components/TransactionModal.js
import React, { useEffect, useState } from "react";
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-ui-datepicker";

export default function TransactionModal({
  visible,
  mode = "add", // "add" or "edit"
  transaction = null,
  onSave,
  onCancel,
  categoryIcons,
  categoryColors,
}) {
  // local state for form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Clothing");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // When transaction changes → prefill fields
  useEffect(() => {
    if (transaction) {
      setName(transaction.name);
      setCategory(transaction.category);
      setAmount(Math.abs(transaction.amount).toString());
      setDate(new Date(transaction.date || Date.now()));
    } else {
      setName("");
      setCategory("Clothing");
      setAmount("");
      setDate(new Date());
    }
    setShowDatePicker(false);
  }, [transaction, visible]);

  const handleSave = () => {
    if (!name || !amount) return;

    const prepared = {
      ...transaction,
      name,
      category,
      amount: -parseFloat(amount),
      icon: categoryIcons[category],
      color: categoryColors[category],
      date,
    };

    onSave(prepared);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 20, padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" }}>
            {mode === "add" ? "Add Transaction" : "Edit Transaction"}
          </Text>

          <TextInput
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginBottom: 15 }}
            placeholder="Transaction Name"
            value={name}
            onChangeText={setName}
          />

          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>Category</Text>
          <FlatList
            style={{ marginBottom: 15 }}
            data={Object.keys(categoryIcons)}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 20,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 10,
                    backgroundColor: "#f5f5f5",
                  },
                  category === item && {
                    backgroundColor: categoryColors[item] + 45,
                    borderColor: categoryColors[item] + 90,
                  },
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    { fontSize: 14, color: "#333" },
                    category === item && { color: "#fff", fontWeight: "bold" },
                  ]}
                >
                  {categoryIcons[item]} {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
          />

          <TextInput
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginBottom: 15 }}
            placeholder="Amount (€)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>Date</Text>
          {!showDatePicker && (
            <TouchableOpacity
              style={{
                backgroundColor: "#87efefff",
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 15,
              }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                Choose Date ({date.toLocaleDateString("en-GB")})
              </Text>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DatePicker
              mode="single"
              date={date}
              firstDayOfWeek={1}
              onChange={({ date }) => setDate(date)}
              styles={{
                selected: {
                  backgroundColor: "#b3f0f0ff",
                  borderColor: "rgba(102, 235, 235, 1)",
                  borderWidth: 1,
                  borderRadius: 100,
                },
                selected_label: { color: "white", fontWeight: "bold" },
              }}
            />
          )}

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#f0f0f0",
                paddingVertical: 10,
                borderRadius: 20,
                alignItems: "center",
                marginRight: 8,
              }}
              onPress={onCancel}
            >
              <Text style={{ color: "#555", fontWeight: "600", fontSize: 14 }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#00ECEC",
                paddingVertical: 10,
                borderRadius: 20,
                alignItems: "center",
              }}
              onPress={handleSave}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                {mode === "add" ? "Add" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}
