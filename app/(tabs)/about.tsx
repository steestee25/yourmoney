import { Button, StyleSheet, View } from "react-native";
import LanguageToggle from '../../components/LanguageToggle';
import { useTranslation } from '../../lib/i18n';
import { supabase } from '../../lib/supabase';

export default function AboutScreen() {
  const { t } = useTranslation()
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <View style={styles.container}>
      <Button title={t('about.logout')} onPress={handleLogout} />
      <LanguageToggle />
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