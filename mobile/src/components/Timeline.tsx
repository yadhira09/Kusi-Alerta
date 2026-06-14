import { StyleSheet, Text, View } from "react-native";
import type { AlertDto } from "../types";
import { statusFlow, statusLabels, statusMessages } from "../utils/labels";
import { colors } from "../styles/theme";

export function Timeline({ alert }: { alert: AlertDto }) {
  const reached = new Set(alert.histories?.map((history) => history.status) ?? [alert.status]);
  return (
    <View accessibilityLabel="Línea de tiempo de atención">
      {statusFlow.map((status) => {
        const done = reached.has(status) || alert.status === status;
        return (
          <View key={status} style={[styles.item, done ? styles.done : styles.pending]}>
            <Text style={styles.title}>{statusLabels[status]}</Text>
            <Text style={styles.text}>{done ? statusMessages[status] : "Pendiente de actualización"}</Text>
          </View>
        );
      })}
      {alert.status === "RECHAZADO" ? (
        <View style={[styles.item, styles.rejected]}>
          <Text style={styles.title}>Rechazado</Text>
          <Text style={styles.text}>{alert.rejectionReason || "Reporte rechazado por Central."}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { borderLeftWidth: 7, padding: 12, borderRadius: 14, marginVertical: 5 },
  done: { borderLeftColor: colors.green700, backgroundColor: colors.green100 },
  pending: { borderLeftColor: colors.gray200, backgroundColor: colors.gray100 },
  rejected: { borderLeftColor: colors.red700, backgroundColor: colors.red100 },
  title: { color: colors.gray900, fontSize: 16, fontWeight: "900" },
  text: { color: colors.gray700, marginTop: 3 }
});
