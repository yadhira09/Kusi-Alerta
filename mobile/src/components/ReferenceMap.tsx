import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export function ReferenceMap() {
  return (
    <View style={styles.map} accessibilityLabel="Mapa referencial del Mercado Santa Rosa">
      <View style={styles.radius} />
      <Text style={styles.market}>Mercado Santa Rosa</Text>
      <Text style={styles.zone}>Zona crítica simulada</Text>
      <Text style={styles.caption}>Radio referencial: 5 cuadras alrededor del mercado.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 230, backgroundColor: "#eef3fb", borderWidth: 1, borderColor: colors.gray200, borderRadius: 18, alignItems: "center", justifyContent: "center", overflow: "hidden", marginVertical: 10 },
  radius: { position: "absolute", width: 190, height: 190, borderRadius: 999, borderWidth: 3, borderColor: colors.blue600, opacity: 0.45 },
  market: { backgroundColor: colors.blue900, color: colors.white, padding: 12, borderRadius: 14, fontWeight: "900", textAlign: "center" },
  zone: { position: "absolute", right: 14, top: 18, backgroundColor: colors.yellow100, color: colors.yellow700, padding: 8, borderRadius: 12, fontWeight: "900" },
  caption: { position: "absolute", bottom: 16, color: colors.blue800, fontWeight: "900" }
});
