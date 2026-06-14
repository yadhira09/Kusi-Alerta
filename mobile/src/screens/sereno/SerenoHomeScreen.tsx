import { useCallback, useEffect, useMemo, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { AvailabilityBadge, StatusBadge } from "../../components/StatusBadge";
import { getAllAlerts, getSerenos } from "../../services/api";
import { createSerenoSocket } from "../../services/socket";
import { colors } from "../../styles/theme";
import type { AlertDto, SerenoDto } from "../../types";
import type { RootStackParamList } from "../../types/navigation";
import { elapsedLabel } from "../../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "SerenoHome">;

export function SerenoHomeScreen({ navigation }: Props) {
  const [serenos, setSerenos] = useState<SerenoDto[]>([]);
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const sereno = useMemo(() => serenos.find((item) => item.name.includes("Luis Mamani")) ?? serenos[0], [serenos]);

  const load = useCallback(async () => {
    const [serenoData, alertData] = await Promise.all([getSerenos(), getAllAlerts()]);
    setSerenos(serenoData);
    setAlerts(alertData);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!sereno?.id) return;
    const socket = createSerenoSocket(sereno.id);
    socket.on("alert_updated", () => void load());
    socket.on("alert_assigned", () => void load());
    return () => socket.disconnect();
  }, [sereno?.id, load]);

  const assigned = alerts.filter((alert) => alert.assignedSerenoId === sereno?.id && !["ATENDIDO", "RECHAZADO"].includes(alert.status));

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Card>
        <Text style={styles.title}>{sereno?.name || "Sereno demo"}</Text>
        {sereno ? <AvailabilityBadge availability={sereno.availability} /> : null}
        <Text style={styles.text}>Zona actual: {sereno?.currentZone || "Mercado Santa Rosa"}</Text>
        <AppButton accessibilityLabel="Ver checklist operativo" variant="secondary" onPress={() => navigation.navigate("Checklist")}>Ver checklist operativo</AppButton>
      </Card>

      <Text style={styles.sectionTitle}>Alertas asignadas</Text>
      {assigned.length === 0 ? <Card><Text style={styles.text}>No hay alertas asignadas pendientes para este sereno.</Text></Card> : null}
      {assigned.map((alert) => (
        <Card key={alert.id}>
          <View style={styles.row}>
            <Text style={styles.code}>{alert.code}</Text>
            <StatusBadge status={alert.status} />
          </View>
          <Text style={styles.text}>{alert.type}</Text>
          <Text style={styles.text}>Referencia: {alert.reference}</Text>
          <Text style={styles.timer}>Cronómetro desde asignación: {elapsedLabel(alert.assignedAt || alert.createdAt)}</Text>
          <AppButton accessibilityLabel={`Abrir alerta ${alert.code}`} accessibilityHint="Muestra el detalle operativo" onPress={() => navigation.navigate("SerenoAlertDetail", { alertId: alert.id, serenoId: sereno?.id || "" })}>Ver detalle</AppButton>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: colors.blue900, fontSize: 26, fontWeight: "900" },
  sectionTitle: { color: colors.blue900, fontSize: 22, fontWeight: "900", marginTop: 10 },
  text: { color: colors.gray700, fontSize: 16, marginVertical: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  code: { color: colors.blue900, fontWeight: "900", fontSize: 20 },
  timer: { color: colors.blue800, fontWeight: "900", marginTop: 8 }
});
