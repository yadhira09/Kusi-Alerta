import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../../components/Card";
import { colors } from "../../styles/theme";

const items = [
  "Verificar situación.",
  "Mantener distancia segura.",
  "Coordinar apoyo si corresponde.",
  "Registrar resultado."
];

export function ChecklistScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.title}>Checklist operativo</Text>
        {items.map((item) => (
          <View key={item} style={styles.item}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </Card>
      <Card>
        <Text style={styles.warning}>Este checklist es orientativo para Serenazgo. No representa función policial, judicial, sancionadora ni fiscalizadora.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: colors.blue900, fontSize: 24, fontWeight: "900", marginBottom: 10 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  check: { color: colors.green700, fontSize: 22, fontWeight: "900" },
  text: { color: colors.gray900, fontSize: 17, fontWeight: "800", flex: 1 },
  warning: { color: colors.red700, fontWeight: "900", lineHeight: 22 }
});
