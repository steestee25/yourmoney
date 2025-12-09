// components/TransactionModal.js
import React, { useEffect, useState } from "react";
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-ui-datepicker";

import styles from "../styles/components/transactionModal.styles";
export default function TransactionModal({
    visible,
    mode = "add",
    transaction = null,
    onSave,
    onCancel,
    categoryIcons,
    categoryColors,
}) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Clothing");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isIncome, setIsIncome] = useState(false); // true = entrata, false = uscita

    useEffect(() => {
        if (transaction) {
            setName(transaction.name);
            setCategory(transaction.category);
            setAmount(Math.abs(transaction.amount).toString());
            setDate(new Date(transaction.date || Date.now()));
            setIsIncome(transaction.amount > 0); // Se amount è positivo, è un'entrata
        } else {
            setName("");
            setCategory("Clothing");
            setAmount("");
            setDate(new Date());
            setIsIncome(false); // Default: uscita
        }
        setShowDatePicker(false);
    }, [transaction, visible]);

    const handleSave = () => {
        if (!name || !amount) return;

        const numAmount = parseFloat(amount);
        const signedAmount = isIncome ? numAmount : -numAmount; // Positivo se entrata, negativo se uscita

        const prepared = {
            ...transaction,
            name,
            category,
            amount: signedAmount,
            icon: categoryIcons[category],
            color: categoryColors[category],
            date,
        };

        onSave(prepared);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
            <ScrollView style={styles.modalBackground} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{mode === "add" ? "Add Transaction" : "Edit Transaction"}</Text>

                    <TextInput style={styles.input} placeholder="Transaction Name" value={name} onChangeText={setName} />

                    <View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 10,
                                marginHorizontal: 5,
                                backgroundColor: !isIncome ? '#EA4335' : '#f0f0f0',
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                            onPress={() => setIsIncome(false)}
                        >
                            <Text style={{ color: !isIncome ? '#fff' : '#333', fontWeight: 'bold' }}>Expense</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 10,
                                marginHorizontal: 5,
                                backgroundColor: isIncome ? '#34A853' : '#f0f0f0',
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                            onPress={() => setIsIncome(true)}
                        >
                            <Text style={{ color: isIncome ? '#fff' : '#333', fontWeight: 'bold' }}>Income</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Category</Text>
                    <FlatList
                        style={{ marginBottom: 15 }}
                        data={Object.keys(categoryIcons)}
                        horizontal
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.categoryItem,
                                    category === item && {
                                        backgroundColor: categoryColors[item] + 45,
                                        borderColor: categoryColors[item] + 90,
                                    },
                                ]}
                                onPress={() => setCategory(item)}
                            >
                                <Text style={[{ fontSize: 14, color: "#333" }, category === item && styles.categoryItemSelected]}>
                                    {categoryIcons[item]} {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                    />

                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Amount (€)</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="€"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={{ marginBottom: 15 }}>
                        <View style={styles.dateRow}>
                            <Text style={styles.amountLabel}>Date</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                                <Text style={styles.dateButtonText}>{date.toLocaleDateString("en-GB")}</Text>
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                            <DatePicker
                                mode="single"
                                date={date}
                                firstDayOfWeek={1}
                                onChange={({ date }) => {
                                    setDate(date);
                                    setShowDatePicker(false);
                                }}
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
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>{mode === "add" ? "Add" : "Save"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );
}
