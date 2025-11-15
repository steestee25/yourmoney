// components/TransactionModal.styles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/color";

export default StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
    },
    title: {
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
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
    },
    categoryItem: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 10,
        backgroundColor: "#f5f5f5",
    },
    categoryItemSelected: {
        color: COLORS.white,
        fontWeight: "bold",
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    amountLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginRight: 10,
        width: 180,
    },
    amountInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        textAlign: "center",
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    dateButton: {
        flex: 1,
        backgroundColor: "#87efefff",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    dateButtonText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 14,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
        marginRight: 8,
    },
    cancelButtonText: {
        color: "#555",
        fontWeight: "600",
        fontSize: 14,
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
    },
    saveButtonText: {
        color: COLORS.white,
        fontWeight: "600",
        fontSize: 14,
    },
});
