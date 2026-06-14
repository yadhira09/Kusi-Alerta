import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { colors } from "../../styles/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "RoleSelector">;

export function RoleSelectorScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Prototipo funcional</Text>
        <Text style={styles.title}>KusiAlerta</Text>
        <Text style={styles.subtitle}>Ciudadano protegido, Serenazgo en ruta</Text>
      </View>
      <Card>
        <Text style={styles.body}>Selecciona un modo para la demo. Ambos roles viven dentro de la misma app móvil.</Text>
        <AppButton accessibilityLabel="Entrar como ciudadano" accessibilityHint="Abre la pantalla de inicio ciudadano" onPress={() => navigation.navigate("CitizenHome")}>Entrar como ciudadano</AppButton>
        <AppButton accessibilityLabel="Entrar como sereno" accessibilityHint="Abre las alertas asignadas al sereno" variant="secondary" onPress={() => navigation.navigate("SerenoHome")}>Entrar como sereno</AppButton>
        <Text style={styles.disclaimer}>Este prototipo utiliza datos ficticios para fines demostrativos.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, gap: 12 },
  hero: { backgroundColor: colors.blue900, borderRadius: 26, padding: 24, marginTop: 8 },
  eyebrow: { color: "#b7d3ff", fontWeight: "900", textTransform: "uppercase", letterSpacing: 1 },
  title: { color: colors.white, fontWeight: "900", fontSize: 42, marginTop: 6 },
  subtitle: { color: colors.white, fontWeight: "800", fontSize: 18 },
  body: { color: colors.gray700, fontSize: 16, marginBottom: 12 },
  disclaimer: { color: colors.gray700, marginTop: 10, fontSize: 13 }
});
