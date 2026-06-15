import { useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { createAlert, getUsers } from "../../services/api";
import { colors } from "../../styles/theme";
import type { UserDto } from "../../types";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "CreateAlert">;

const types = [
  "Consumo de alcohol en vía pública",
  "Alteración del orden público",
  "Pelea o disturbio",
  "Ruido excesivo",
  "Otro"
];

export function CreateAlertScreen({ navigation, route }: Props) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(route.params?.prefillType || types[0]);
  const [reference, setReference] = useState("Frente a una tienda / cerca de la esquina / al costado del mercado");
  const [description, setDescription] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [citizen, setCitizen] = useState<UserDto | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUsers().then((users) => setCitizen(users.find((user) => user.role === "CITIZEN") ?? null)).catch(() => undefined);
  }, []);

async function submit() {
  try {
    setSubmitting(true);
    const alerta = await createAlert({
      citizenId: citizen?.id,
      type: selectedType,
      reference,
      description,
      evidenceText: evidenceText || "Sin evidencia",
    });
    navigation.replace("CitizenHome");
    setTimeout(() => {
      Alert.alert("✅ Alerta enviada", `Código: ${alerta.code}`);
    }, 300);
  } catch (error) {
    console.error("ERROR AL ENVIAR:", error); // 👈 esto te mostrará el error real
    Alert.alert("No se pudo enviar", "Revisa que el backend esté activo.");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.progress}>Paso {step} de 3 · Kusi Rápido</Text>
        {step === 1 ? (
          <View>
            <Text style={styles.title}>¿Qué está ocurriendo?</Text>
            {types.map((item) => (
              <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Seleccionar ${item}`} onPress={() => setSelectedType(item)} style={[styles.option, selectedType === item && styles.optionActive]}>
                <Text style={[styles.optionText, selectedType === item && styles.optionTextActive]}>{item}</Text>
              </Pressable>
            ))}
            <AppButton accessibilityLabel="Continuar a ubicación" accessibilityHint="Avanza al paso dos" onPress={() => setStep(2)}>Continuar</AppButton>
          </View>
        ) : null}

        {step === 2 ? (
          <View>
            <Text style={styles.title}>Ubicación referencial</Text>
            <Text style={styles.location}>Mercado Santa Rosa, Coronel Gregorio Albarracín Lanchipa, Tacna</Text>
            <Text style={styles.hint}>Radio referencial: 5 cuadras alrededor del Mercado Santa Rosa.</Text>
            <Text style={styles.label}>Referencia del lugar</Text>
            <TextInput value={reference} onChangeText={setReference} style={styles.input} multiline accessibilityLabel="Referencia del lugar" placeholder="Frente a una tienda / cerca de la esquina / al costado del mercado" />
            <AppButton accessibilityLabel="Continuar a descripción" accessibilityHint="Avanza al paso tres" onPress={() => setStep(3)}>Continuar</AppButton>
            <AppButton accessibilityLabel="Volver al paso anterior" variant="secondary" onPress={() => setStep(1)}>Volver</AppButton>
          </View>
        ) : null}

        {step === 3 ? (
          <View>
            <Text style={styles.title}>Descripción y evidencia</Text>
            <Text style={styles.label}>Descripción breve</Text>
            <TextInput value={description} onChangeText={setDescription} style={[styles.input, styles.textarea]} multiline accessibilityLabel="Descripción breve" placeholder="Describe lo que ocurre sin exponerte" />
            <AppButton accessibilityLabel="Adjuntar evidencia opcional" accessibilityHint="Carga una evidencia simulada" variant="secondary" onPress={() => setEvidenceText("Evidencia simulada cargada")}>Adjuntar evidencia opcional</AppButton>
            <AppButton accessibilityLabel="Omitir evidencia por seguridad" accessibilityHint="Continúa sin evidencia" variant="secondary" onPress={() => setEvidenceText("Sin evidencia por seguridad")}>Omitir evidencia por seguridad</AppButton>
            {evidenceText ? <Text style={styles.success}>{evidenceText}</Text> : null}
            <Text style={styles.warning}>No te expongas para tomar fotos o videos. Tu seguridad es primero.</Text>
            <AppButton accessibilityLabel="Enviar alerta" accessibilityHint="Registra la alerta y activa el modo discreto" disabled={submitting} onPress={submit}>{submitting ? "Enviando..." : "Enviar alerta"}</AppButton>
            <AppButton accessibilityLabel="Volver al paso anterior" variant="secondary" onPress={() => setStep(2)}>Volver</AppButton>
          </View>
        ) : null}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  progress: { color: colors.blue600, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  title: { color: colors.gray900, fontWeight: "900", fontSize: 24, marginBottom: 12 },
  option: { minHeight: 54, borderWidth: 1, borderColor: colors.gray200, borderRadius: 16, padding: 14, marginVertical: 5, backgroundColor: colors.white },
  optionActive: { backgroundColor: colors.blue900, borderColor: colors.blue900 },
  optionText: { color: colors.gray900, fontWeight: "800" },
  optionTextActive: { color: colors.white },
  location: { backgroundColor: "#e7f0ff", color: colors.blue800, padding: 12, borderRadius: 14, fontWeight: "900", marginBottom: 8 },
  hint: { color: colors.gray700, marginBottom: 12 },
  label: { color: colors.gray900, fontWeight: "900", marginTop: 8, marginBottom: 5 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.gray200, borderRadius: 16, padding: 12, backgroundColor: colors.white, color: colors.gray900 },
  textarea: { minHeight: 110, textAlignVertical: "top" },
  warning: { backgroundColor: colors.yellow100, color: colors.yellow700, padding: 12, borderRadius: 14, marginVertical: 8, fontWeight: "800" },
  success: { color: colors.green700, fontWeight: "900", marginVertical: 8 }
});
