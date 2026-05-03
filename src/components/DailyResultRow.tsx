import { StyleSheet, Text, View } from "react-native";
import { DailySizzlingHotProductDto } from "../api/sizzlingHotProductsClient";

export function DailyResultRow({ item }: { item: DailySizzlingHotProductDto }) {
  return (
    <View style={styles.dailyRow}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateBadgeText}>{item.date.slice(0, 5)}</Text>
        <Text style={styles.dateBadgeYear}>{item.date.slice(6)}</Text>
      </View>
      <View style={styles.dailyDetails}>
        <Text style={styles.productName}>{item.productName ?? "No sales"}</Text>
        <Text style={styles.productMeta}>
          {item.productId ?? "-"} · {item.salesCount} qualified sales
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dailyRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "row",
    gap: 14,
    padding: 14
  },
  dateBadge: {
    alignItems: "center",
    backgroundColor: "#F6D948",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 58,
    width: 66
  },
  dateBadgeText: {
    color: "#193A28",
    fontSize: 18,
    fontWeight: "900"
  },
  dateBadgeYear: {
    color: "#375241",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2
  },
  dailyDetails: {
    flex: 1
  },
  productName: {
    color: "#1D2A22",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 21,
    marginBottom: 6
  },
  productMeta: {
    color: "#647069",
    fontSize: 13,
    fontWeight: "700"
  }
});
