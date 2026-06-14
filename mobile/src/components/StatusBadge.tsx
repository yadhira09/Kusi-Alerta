import { StyleSheet, Text, View } from "react-native";
import type { AlertStatus, Priority, SerenoAvailability } from "../types";
import { availabilityLabels, statusLabels } from "../utils/labels";
import { colors } from "../styles/theme";

export function StatusBadge({ status }: { status: AlertStatus }) {
  const style = statusStyles[status];
  return <Text accessibilityLabel={`Estado: ${statusLabels[status]}`} style={[styles.badge, style]}>{statusLabels[status]}</Text>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Text style={[styles.badge, styles.priority]}>Prioridad {priority}</Text>;
}

export function AvailabilityBadge({ availability }: { availability: SerenoAvailability }) {
  const color = availability === "DISPONIBLE" ? colors.green700 : availability === "EN_ATENCION" ? colors.yellow700 : colors.red700;
  return (
    <View style={styles.availabilityRow} accessibilityLabel={`Estado operativo: ${availabilityLabels[availability]}`}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.availabilityText}>{availabilityLabels[availability]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, overflow: "hidden", fontWeight: "900", marginVertical: 3 },
  priority: { backgroundColor: colors.yellow100, color: colors.yellow700 },
  availabilityRow: { flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 5 },
  dot: { width: 14, height: 14, borderRadius: 999 },
  availabilityText: { fontWeight: "900", color: colors.gray900 }
});

const statusStyles = StyleSheet.create<Record<AlertStatus, object>>({
  PENDIENTE: { backgroundColor: colors.yellow100, color: colors.yellow700 },
  RECIBIDO: { backgroundColor: "#e7f0ff", color: colors.blue800 },
  ASIGNADO: { backgroundColor: "#e7f0ff", color: colors.blue800 },
  EN_DESPLIEGUE: { backgroundColor: colors.purple100, color: colors.purple700 },
  EN_INTERVENCION: { backgroundColor: colors.purple100, color: colors.purple700 },
  ATENDIDO: { backgroundColor: colors.green100, color: colors.green700 },
  RECHAZADO: { backgroundColor: colors.red100, color: colors.red700 }
});
