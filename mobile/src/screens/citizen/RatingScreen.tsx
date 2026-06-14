import { useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { rateAlert } from "../../services/api";
import { colors } from "../../styles/theme";
import type { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Rating">;

export function RatingScreen({ navigation, route }: Props) {
  const { alertId, citizenId } = route.params;
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    try {
      setSubmitting(true);
      await rateAlert(alertId, { stars, comment });
      Alert.alert("Gracias", "Gracias por ayudar a mantener segura tu comunidad.");
      navigation.replace("CitizenTracking", { alertId, citizenId });
    } catch {
      Alert.alert("No se pudo calificar", "Intenta nuevamente con el backend activo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.title}>Califica la atención</Text>
        <Text style={styles.text}>Selecciona de 1 a 5 estrellas.</Text>
        <View style={styles.stars} accessibilityLabel={`Calificación seleccionada: ${stars} estrellas`}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable key={value} accessibilityRole="button" accessibilityLabel={`${value} estrella${value > 1 ? "s" : ""}`} onPress={() => setStars(value)} style={styles.starButton}>
              <Text style={value <= stars ? styles.starActive : styles.star}>★</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Comentario opcional</Text>
        <TextInput value={comment} onChangeText={setComment} style={styles.input} multiline placeholder="Escribe un comentario breve" accessibilityLabel="Comentario opcional" />
        <AppButton accessibilityLabel="Enviar calificación" accessibilityHint="Guarda la calificación de atención" disabled={submitting} onPress={submit}>{submitting ? "Enviando..." : "Enviar calificación"}</AppButton>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: colors.blue900, fontWeight: "900", fontSize: 26 },
  text: { color: colors.gray700, marginVertical: 8 },
  stars: { flexDirection: "row", gap: 5, marginVertical: 12 },
  starButton: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  star: { fontSize: 36, color: colors.gray200 },
  starActive: { fontSize: 36, color: colors.yellow700 },
  label: { color: colors.gray900, fontWeight: "900" },
  input: { minHeight: 100, borderWidth: 1, borderColor: colors.gray200, backgroundColor: colors.white, borderRadius: 16, padding: 12, textAlignVertical: "top", marginVertical: 8 }
});
