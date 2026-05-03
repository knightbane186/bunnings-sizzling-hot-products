import Constants from "expo-constants";

interface ExpoRuntimeConstants {
  expoConfig?: {
    hostUri?: string;
  };
  manifest?: {
    debuggerHost?: string;
  };
  manifest2?: {
    extra?: {
      expoClient?: {
        hostUri?: string;
      };
      expoGo?: {
        debuggerHost?: string;
      };
    };
  };
}

function getExpoHostIp(): string | null {
  const runtimeConstants = Constants as ExpoRuntimeConstants;
  const hostUri =
    runtimeConstants.expoConfig?.hostUri ??
    runtimeConstants.manifest2?.extra?.expoClient?.hostUri ??
    runtimeConstants.manifest?.debuggerHost ??
    runtimeConstants.manifest2?.extra?.expoGo?.debuggerHost;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(":")[0] ?? null;
}

export const GRAPHQL_URL =
  process.env.EXPO_PUBLIC_GRAPHQL_URL ??
  `http://${getExpoHostIp() ?? "127.0.0.1"}:4000/graphql`;
