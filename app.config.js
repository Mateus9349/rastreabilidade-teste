export default {
  expo: {
    name: "Gygas",
    slug: "gygas",
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
      bundleIdentifier: "org.fasamazonia.gygas"
    },

    android: {
      package: "org.fasamazonia.gygas",
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
        projectId: "7c1d5edc-23c4-462a-ab49-6cf30f47a021"
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

    plugins: ["expo-font", "expo-sqlite"],

    experiments: {
      newArchEnabled: true
    }
  }
};