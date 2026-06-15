import { useCallback, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Card } from "../../components/Card";
import { StatusBadge } from "../../components/StatusBadge";
import { Timeline } from "../../components/Timeline";
import { getCitizenHistory, getUsers } from "../../services/api";
import { colors } from "../../styles/theme";
import type { AlertDto, UserDto } from "../../types";
import type { RootStackParamList } from "../../types/navigation";
import { formatDate } from "../../utils/labels";

type Props = NativeStackScreenProps<RootStackParamList, "CitizenHistory">;

export function CitizenHistoryScreen({ navigation }: Props) {
  const [citizen, setCitizen] = useState<UserDto | null>(null);
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

 const load = useCallback(async () => {
    try {
      const users = await getUsers();
      const citizenDemo = users.find((user) => user.role === "CITIZEN") ?? null;
      setCitizen(citizenDemo);
      if (citizenDemo) {
        const history = await getCitizenHistory(citizenDemo.id);
        console.log("HISTORIAL:", JSON.stringify(history));
        setAlerts(history);
      }
    } catch (error) {
      console.error("ERROR HISTORIAL:", error);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={styles.title}>Historial ciudadano</Text>
      <Text style={styles.subtitle}>Ciudadano ficticio: {citizen?.name || "Rosa Quispe"}</Text>
      {alerts.map((alert) => (
        <Card key={alert.id}>
          <View style={styles.row}>
            <Text style={styles.code}>{alert.code}</Text>
            <StatusBadge status={alert.status} />
          </View>
          <Text style={styles.text}>{alert.type}</Text>
          <Text style={styles.text}>Fecha: {formatDate(alert.createdAt)}</Text>
          <Timeline alert={alert} />
          <Text style={styles.rating}>Calificación: {alert.rating ? `${alert.rating.stars}/5` : "Sin calificar"}</Text>
          <AppButton accessibilityLabel={`Ver seguimiento de ${alert.code}`} variant="secondary" onPress={() => navigation.navigate("CitizenTracking", { alertId: alert.id, citizenId: alert.citizenId })}>Ver seguimiento</AppButton>
          {alert.status === "ATENDIDO" ? <AppButton accessibilityLabel={`Calificar ${alert.code}`} onPress={() => navigation.navigate("Rating", { alertId: alert.id, citizenId: alert.citizenId })}>Calificar atención</AppButton> : null}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: colors.blue900, fontWeight: "900", fontSize: 26 },
  subtitle: { color: colors.gray700, marginTop: 4, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" },
  code: { color: colors.blue900, fontWeight: "900", fontSize: 20 },
  text: { color: colors.gray700, marginVertical: 2 },
  rating: { color: colors.green700, fontWeight: "900", marginTop: 8 }
});
