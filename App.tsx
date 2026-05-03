import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { AppHeader } from "./src/components/AppHeader";
import { BrandPanel } from "./src/components/BrandPanel";
import { DailyResultRow } from "./src/components/DailyResultRow";
import { PeriodLeaderCard } from "./src/components/PeriodLeaderCard";
import { StatusView } from "./src/components/StatusView";
import { useSizzlingHotProducts } from "./src/hooks/useSizzlingHotProducts";

export default function App() {
  const { data, error, loading, refreshing, refetch } = useSizzlingHotProducts();

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} />
        }
      >
        <AppHeader />
        <BrandPanel />

        {loading ? (
          <StatusView message="Loading sizzling hot products..." />
        ) : error ? (
          <StatusView
            message="Unable to load products"
            detail={error}
            onRetry={refetch}
          />
        ) : data ? (
          <>
            <PeriodLeaderCard period={data.period} />

            <View style={styles.dailyHeading}>
              <Text style={styles.sectionTitle}>Daily History</Text>
            </View>

            <View style={styles.dailyList}>
              {data.daily.map((item) => (
                <DailyResultRow key={item.date} item={item} />
              ))}
            </View>
          </>
        ) : (
          <StatusView message="No products available" onRetry={refetch} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B5D3B",
    paddingTop: Constants.statusBarHeight
  },
  container: {
    padding: 20,
    paddingBottom: 32
  },
  dailyHeading: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0,
    marginBottom: 0
  },
  dailyList: {
    gap: 10
  }
});
