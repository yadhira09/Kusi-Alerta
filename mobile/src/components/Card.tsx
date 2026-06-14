import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../styles/theme";

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 22, padding: 16, marginVertical: 8, borderWidth: 1, borderColor: colors.gray200, shadowColor: colors.blue900, shadowOpacity: 0.08, shadowRadius: 16, elevation: 2 }
});
