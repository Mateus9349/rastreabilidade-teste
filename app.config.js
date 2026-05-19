export default {
  expo: {
    name: "GIGANTIO",
    slug: "rastreabilidade-teste",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mateus9349.rastreabilidadeteste"
    },
    android: {
      package: "com.mateus9349.rastreabilidadeteste",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#A11814"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "0a39980e-3718-4ea3-9318-5bdb4665f75f"
      },
      expoClient: {
        experiments: {
          newArchEnabled: true
        }
      },
      keycloak: {
        baseUrl: process.env.EXPO_PUBLIC_KEYCLOAK_BASE_URL || "",
        realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM || "",
        clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || "",
        clientSecret: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET || ""
      }
    },
    plugins: [
      "expo-font",
      "expo-sqlite"
    ],
    experiments: {
      newArchEnabled: true
    }
  }
};
