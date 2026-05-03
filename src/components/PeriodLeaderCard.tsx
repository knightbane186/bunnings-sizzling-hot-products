import { Image, StyleSheet, Text, View } from "react-native";
import { PeriodSizzlingHotProductDto } from "../api/sizzlingHotProductsClient";

export function PeriodLeaderCard({
  period
}: {
  period: PeriodSizzlingHotProductDto;
}) {
  return (
    <View style={styles.periodPanel}>
      <View style={styles.periodHeading}>
        <View style={styles.labelGroup}>
          <View style={styles.flameTile}>
            <Image
              source={require("../../readme/flame.png")}
              style={styles.flameIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.sectionLabel}>3-day leader</Text>
        </View>
        <Text style={styles.dateRange}>
          {period.startDate} - {period.endDate}
        </Text>
      </View>
      <Text style={styles.periodProduct}>
        {period.productName ?? "No sales for this period"}
      </Text>
      <Text style={styles.salesCount}>{period.salesCount} qualified sales</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  periodPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 24,
    padding: 18
  },
  periodHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },
  labelGroup: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  flameTile: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF2EF",
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 48
  },
  flameIcon: {
    height: 26,
    width: 36
  },
  sectionLabel: {
    color: "#0B5D3B",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  dateRange: {
    color: "#5B665F",
    fontSize: 13,
    fontWeight: "700"
  },
  periodProduct: {
    color: "#1D2A22",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 28,
    marginBottom: 10
  },
  salesCount: {
    color: "#C83A24",
    fontSize: 15,
    fontWeight: "800"
  }
});
