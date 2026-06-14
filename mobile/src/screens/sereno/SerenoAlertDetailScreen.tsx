import { useCallback, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { ReferenceMap } from "../../components/ReferenceMap";
import { StatusBadge } from "../../components/StatusBadge";
import { Timeline } from "../../components/Timeline";
import { getAlert, updateAlertStatus } from "../../services/api";
import { createSerenoSocket } from "../../services/socket";
import { colors } from "../../styles/theme";
import type { AlertDto } from "../../types";
import type { RootStackParamList } from "../../types/navigation";
import { elapsedLabel } from "../../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "SerenoAlertDetail">;

export function SerenoAlertDetailScreen({ navigation, route }: Props) {
  const { alertId, serenoId } = route.params;
  const [alert, setAlert] = useState<AlertDto | null>(null);

  const load = useCallback(async () => setAlert(await getAlert(alertId)), [alertId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const socket = createSerenoSocket(serenoId);
    socket.on("alert_updated", (updated: AlertDto) => {
      if (updated.id === alertId) setAlert(updated);
    });
    return () => socket.disconnect();
  }, [alertId, serenoId]);

  async function update(status: "EN_DESPLIEGUE" | "EN_INTERVENCION") {
    try {
      const updated = await updateAlertStatus(alertId, status);
      setAlert(updated);
    } catch {
      Alert.alert("No se pudo actualizar", "Verifica que el backend esté activo.");
    }
  }

  if (!alert) return <ScrollView contentContainerStyle={styles.container}><Text>Cargando alerta...</Text></ScrollView>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.code}>{alert.code}</Text>
        <StatusBadge status={alert.status} />
        <Text style={styles.title}>{alert.type}</Text>
        <Text style={styles.text}>{alert.description || "Sin descripción adicional."}</Text>
        <Text style={styles.label}>Ubicación referencial</Text>
        <Text style={styles.text}>{alert.locationText}</Text>
        <Text style={styles.label}>Referencia</Text>
        <Text style={styles.text}>{alert.reference}</Text>
        <Text style={styles.label}>Evidencia simulada</Text>
        <Text style={styles.text}>{alert.evidenceText || "Sin evidencia por seguridad"}</Text>
        <Text style={styles.timer}>Cronómetro desde asignación: {elapsedLabel(alert.assignedAt || alert.createdAt)}</Text>
        <ReferenceMap />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Historial breve</Text>
        <Timeline alert={alert} />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Actualizar atención</Text>
        <AppButton accessibilityLabel="Confirmar desplazamiento" accessibilityHint="Cambia el estado a en despliegue" disabled={!(["ASIGNADO"].includes(alert.status))} onPress={() => update("EN_DESPLIEGUE")}>Confirmar desplazamiento</AppButton>
        <AppButton accessibilityLabel="Marcar llegada" accessibilityHint="Cambia el estado a en intervención" disabled={!(["EN_DESPLIEGUE"].includes(alert.status))} onPress={() => update("EN_INTERVENCION")}>Marcar llegada</AppButton>
        <AppButton accessibilityLabel="Cerrar caso" accessibilityHint="Abre formulario de cierre" disabled={!(["EN_INTERVENCION"].includes(alert.status))} onPress={() => navigation.navigate("CloseCase", { alert, serenoId })}>Cerrar caso</AppButton>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  code: { color: colors.blue900, fontWeight: "900", fontSize: 26 },
  title: { color: colors.gray900, fontSize: 22, fontWeight: "900", marginTop: 8 },
  sectionTitle: { color: colors.blue900, fontSize: 20, fontWeight: "900", marginBottom: 8 },
  text: { color: colors.gray700, fontSize: 16, lineHeight: 23 },
  label: { color: colors.gray900, fontWeight: "900", marginTop: 10 },
  timer: { color: colors.blue800, fontWeight: "900", marginTop: 10 }
});
