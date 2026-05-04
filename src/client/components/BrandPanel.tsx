import { Image, StyleSheet, View } from "react-native";

export function BrandPanel() {
  return (
    <View style={styles.brandPanel}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.assignmentLogo}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  brandPanel: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 134,
    justifyContent: "center",
    marginBottom: 14,
    overflow: "hidden"
  },
  assignmentLogo: {
    height: 176,
    width: "112%"
  }
});
