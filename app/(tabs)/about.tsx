import { Button, StyleSheet, View } from "react-native";
import { supabase } from '../../lib/supabase';

export default function AboutScreen() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
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