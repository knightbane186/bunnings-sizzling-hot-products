import { Pressable, StyleSheet, Text, View } from "react-native";

export function StatusView({
  message,
  detail,
  onRetry
}: {
  message: string;
  detail?: string | null;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.statusPanel}>
      <Text style={styles.statusMessage}>{message}</Text>
      {detail ? <Text style={styles.statusDetail}>{detail}</Text> : null}
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  statusPanel: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18
  },
  statusMessage: {
    color: "#1D2A22",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center"
  },
  statusDetail: {
    color: "#647069",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center"
  },
  retryButton: {
    backgroundColor: "#0B5D3B",
    borderRadius: 8,
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800"
  }
});
