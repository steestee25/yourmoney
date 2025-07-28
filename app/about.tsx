import {Text, View, StyleSheet} from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text>YourMoney</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    color: "#333",
  }
});