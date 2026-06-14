import { useCallback, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { ReferenceMap } from "../../components/ReferenceMap";
import { StatusBadge } from "../../components/StatusBadge";
import { Timeline } from "../../components/Timeline";
import { getAlert } from "../../services/api";
import { createCitizenSocket } from "../../services/socket";
import { colors } from "../../styles/theme";
import type { AlertDto } from "../../types";
import type { RootStackParamList } from "../../types/navigation";
import { elapsedLabel, statusMessages } from "../../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "CitizenTracking">;

export function CitizenTrackingScreen({ navigation, route }: Props) {
  const { alertId, citizenId } = route.params;
  const [alert, setAlert] = useState<AlertDto | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getAlert(alertId);
    setAlert(data);
  }, [alertId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const socket = createCitizenSocket(citizenId);
    socket.on("alert_updated", (updated: AlertDto) => {
      if (updated.id === alertId) setAlert(updated);
    });
    socket.on("alert_attended", (updated: AlertDto) => {
      if (updated.id === alertId) setAlert(updated);
    });
    return () => socket.disconnect();
  }, [alertId, citizenId]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (!alert) {
    return <ScrollView contentContainerStyle={styles.container}><Text>Cargando seguimiento...</Text></ScrollView>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Card>
        <Text style={styles.discreetTitle}>Tu alerta fue enviada.</Text>
        <Text style={styles.safe}>Mantente en una zona segura.</Text>
        <Text style={styles.text}>Puedes seguir el avance sin realizar llamadas.</Text>
        <Text style={styles.code}>Código de seguimiento: {alert.code}</Text>
        <StatusBadge status={alert.status} />
        <Text style={styles.message}>{statusMessages[alert.status]}</Text>
        <Text style={styles.timer}>Tiempo desde creación: {elapsedLabel(alert.createdAt)}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Seguimiento tipo delivery</Text>
        <Timeline alert={alert} />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Detalle</Text>
        <Text style={styles.text}>{alert.type}</Text>
        <Text style={styles.text}>Referencia: {alert.reference}</Text>
        <ReferenceMap />
      </Card>

      {alert.status === "ATENDIDO" ? (
        <AppButton accessibilityLabel="Calificar atención" accessibilityHint="Abre formulario de estrellas" onPress={() => navigation.navigate("Rating", { alertId: alert.id, citizenId })}>Calificar atención</AppButton>
      ) : null}
      <AppButton accessibilityLabel="Ver historial" variant="secondary" onPress={() => navigation.navigate("CitizenHistory")}>Ver historial</AppButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  discreetTitle: { fontSize: 25, fontWeight: "900", color: colors.blue900 },
  safe: { color: colors.green700, fontSize: 18, fontWeight: "900", marginTop: 6 },
  text: { color: colors.gray700, fontSize: 16, lineHeight: 23, marginTop: 4 },
  code: { backgroundColor: colors.blue900, color: colors.white, overflow: "hidden", borderRadius: 14, padding: 12, marginTop: 12, fontWeight: "900", fontSize: 17 },
  message: { color: colors.gray900, fontWeight: "900", fontSize: 17, marginTop: 10 },
  timer: { color: colors.blue800, fontWeight: "900", marginTop: 8 },
  sectionTitle: { color: colors.blue900, fontSize: 20, fontWeight: "900", marginBottom: 8 }
});
