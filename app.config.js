export default {
  expo: {
    name: "Gygas",
    slug: "gygas",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    icon: "./assets/icon.png",

    plugins: [
      "expo-font",
      "expo-sqlite",
      [
        "expo-splash-screen",
        {
          image: "./assets/splash.png",
          resizeMode: "contain",
          backgroundColor: "#001b45",
          imageWidth: 200
        }
      ]
    ],

    android: {
      package: "org.fasamazonia.gygas",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#001b45"
      }
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "org.fasamazonia.gygas"
    },

    web: {
      favicon: "./assets/favicon.png"
    },

    experiments: {
      newArchEnabled: true
    },

    extra: {
      eas: {
        projectId: "7c1d5edc-23c4-462a-ab49-6cf30f47a021"
      },
      keycloak: {
        baseUrl: process.env.EXPO_PUBLIC_KEYCLOAK_BASE_URL || "",
        realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM || "",
        clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || "",
        clientSecret: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET || ""
      }
    }
  }
};