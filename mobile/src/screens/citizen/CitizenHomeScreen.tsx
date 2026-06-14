import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { colors } from "../../styles/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "CitizenHome">;

export function CitizenHomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.logo}>KusiAlerta</Text>
        <Text style={styles.title}>Reporta rápido, sigue tu alerta y mantente informado</Text>
        <Text style={styles.text}>Ambientado en el Mercado Santa Rosa y sus alrededores, con radio referencial de cinco cuadras.</Text>
        <AppButton accessibilityLabel="Reportar incidencia" accessibilityHint="Inicia el formulario Kusi Rápido en tres pasos" onPress={() => navigation.navigate("CreateAlert")}>Reportar incidencia</AppButton>
        <AppButton accessibilityLabel="Ver mis alertas" accessibilityHint="Abre el historial ciudadano" variant="secondary" onPress={() => navigation.navigate("CitizenHistory")}>Ver mis alertas</AppButton>
        <AppButton accessibilityLabel="Acceso rápido simulado" accessibilityHint="Abre Kusi Rápido con consumo de alcohol precargado" variant="secondary" onPress={() => navigation.navigate("CreateAlert", { prefillType: "Consumo de alcohol en vía pública" })}>Acceso rápido simulado</AppButton>
        <Text style={styles.disclaimer}>Este prototipo utiliza datos ficticios para fines demostrativos.</Text>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Modo seguro</Text>
        <Text style={styles.text}>No te expongas para tomar evidencia. Tu seguridad es primero. Puedes omitir evidencia y seguir el avance sin llamadas.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  logo: { color: colors.blue900, fontWeight: "900", fontSize: 36 },
  title: { color: colors.gray900, fontWeight: "900", fontSize: 22, marginTop: 8, marginBottom: 8 },
  sectionTitle: { color: colors.blue900, fontWeight: "900", fontSize: 20 },
  text: { color: colors.gray700, fontSize: 16, lineHeight: 23 },
  disclaimer: { color: colors.gray700, fontSize: 13, marginTop: 8 }
});
