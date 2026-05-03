import { Image, StyleSheet, Text, View } from "react-native";

export function AppHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/bunnings-logo.jpg")}
        style={styles.bunningsLogo}
        resizeMode="contain"
      />
      <View style={styles.headerCopy}>
        <Text style={styles.eyebrow}>23/04/2026</Text>
        <Text style={styles.title}>Sizzling Hot Products</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginBottom: 22
  },
  bunningsLogo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 54,
    width: 88
  },
  headerCopy: {
    flex: 1
  },
  eyebrow: {
    color: "#D9F1DF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3
  },
  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 32
  }
});
