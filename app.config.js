module.exports = {
  expo: {
    userInterfaceStyle: "light",
    name: "AdVerse DashBoard",
    slug: "adverse",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      googleServicesFile:
        process.env.GOOGLE_SERVICES_PLIST || "./GoogleService-Info.plist",
      supportsTablet: true,
      bundleIdentifier:
        process.env.PROJECT_BUNDLE_ID || "dev.communitybakery.adverse",
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              "com.googleusercontent.apps.955716707860-solhabc5jfk8bi3jnk2okrm1ibqdvf39",
            ],
          },
          {
            CFBundleURLSchemes: [
              "com.googleusercontent.apps.955716707860-solhabc5jfk8bi3jnk2okrm1ibqdvf39",
            ],
          },
        ],
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: process.env.PROJECT_BUNDLE_ID || "dev.communitybakery.adverse",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.955716707860-solhabc5jfk8bi3jnk2okrm1ibqdvf39",
        },
      ],
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "9534d03d-a19f-48fd-914a-3a74af7be226",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: process.env.PROJECT_EXPO_UPDATE || "",
    },
  },
};
