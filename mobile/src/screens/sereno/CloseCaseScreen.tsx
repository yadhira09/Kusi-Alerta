import { useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { closeAlert } from "../../services/api";
import { colors } from "../../styles/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "CloseCase">;

export function CloseCaseScreen({ navigation, route }: Props) {
  const { alert, serenoId } = route.params;
  const [activity, setActivity] = useState("Verificación en zona y orientación preventiva.");
  const [observations, setObservations] = useState("Situación controlada sin confrontación.");
  const [recommendations, setRecommendations] = useState("Mantener patrullaje preventivo alrededor del Mercado Santa Rosa.");
  const [result, setResult] = useState("Atendido sin novedad adicional.");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    try {
      setSubmitting(true);
      const updated = await closeAlert(alert.id, { activity, observations, recommendations, result });
      Alert.alert("Caso atendido", "El caso fue cerrado y el ciudadano ya puede calificar.");
      navigation.replace("SerenoAlertDetail", { alertId: updated.id, serenoId });
    } catch {
      Alert.alert("No se pudo cerrar", "Completa los campos y verifica el backend.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.title}>Cerrar caso como atendido</Text>
        <Text style={styles.code}>{alert.code}</Text>
        <Field label="Actividad realizada" value={activity} onChangeText={setActivity} />
        <Field label="Observaciones" value={observations} onChangeText={setObservations} />
        <Field label="Recomendaciones" value={recommendations} onChangeText={setRecommendations} />
        <Field label="Resultado final" value={result} onChangeText={setResult} />
        <AppButton accessibilityLabel="Cerrar caso como atendido" accessibilityHint="Guarda cierre operativo y cambia el estado a atendido" disabled={submitting} onPress={submit}>{submitting ? "Cerrando..." : "Cerrar caso como atendido"}</AppButton>
      </Card>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} multiline style={styles.input} accessibilityLabel={label} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: colors.blue900, fontSize: 24, fontWeight: "900" },
  code: { color: colors.gray900, fontSize: 18, fontWeight: "900", marginVertical: 8 },
  label: { color: colors.gray900, fontWeight: "900", marginTop: 10 },
  input: { minHeight: 86, borderWidth: 1, borderColor: colors.gray200, borderRadius: 16, padding: 12, backgroundColor: colors.white, color: colors.gray900, textAlignVertical: "top", marginTop: 5 }
});
