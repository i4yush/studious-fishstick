// app.config.js – Dynamic Expo configuration.
// Sensitive / environment-specific values are read from process.env at build
// time.  For local development copy .env.example → .env and fill in values.
// In CI/CD set the variables as pipeline secrets (see DEPLOYMENT.md).

/** @type {import('expo/config').ExpoConfig} */
const config = {
    name: "Runnr",
    slug: "runnr",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#0F0F0F",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: false,
        bundleIdentifier: "com.runnr07.runnr",
        googleServicesFile: "./GoogleService-Info.plist",
        infoPlist: {
            NSCameraUsageDescription: "Used for profile photo uploads.",
            NSPhotoLibraryUsageDescription: "Used for selecting profile photos.",
            NSUserTrackingUsageDescription:
                "We use tracking to improve your experience and provide personalised content.",
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#0F0F0F",
        },
        package: "com.runnr07.runnr",
        googleServicesFile: "./google-services.json",
        permissions: [
            "RECEIVE_BOOT_COMPLETED",
            "VIBRATE",
            "POST_NOTIFICATIONS",
        ],
    },
    web: {
        favicon: "./assets/images/favicon.png",
        bundler: "metro",
    },
    plugins: [
        "expo-router",
        "expo-secure-store",
        [
            "expo-notifications",
            {
                icon: "./assets/images/notification-icon.png",
                color: "#7C3AED",
                sounds: [],
            },
        ],
        [
            "expo-font",
            {
                fonts: [
                    "./assets/fonts/Inter-Regular.ttf",
                    "./assets/fonts/Inter-Medium.ttf",
                    "./assets/fonts/Inter-SemiBold.ttf",
                    "./assets/fonts/Inter-Bold.ttf",
                ],
            },
        ],
    ],
    scheme: "projectrun",
    experiments: {
        typedRoutes: true,
    },
    extra: {
        eas: {
            projectId: "bac7a7be-7b3d-4165-84de-6eb997da2bb8",
        },
        router: {
            origin: false,
        },
    },
};

module.exports = config;
