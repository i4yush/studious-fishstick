// app.config.js – Dynamic Expo configuration.
// Sensitive / environment-specific values are read from process.env at build
// time.  For local development copy .env.example → .env and fill in values.
// In CI/CD set the variables as pipeline secrets (see DEPLOYMENT.md).

/** @type {import('expo/config').ExpoConfig} */
const config = {
    name: "PROJECT-RUN",
    slug: "project-run",
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
        bundleIdentifier: "com.projectrun.app",
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
        package: "com.projectrun.app",
        googleServicesFile: "./google-services.json",
        permissions: [
            "RECEIVE_BOOT_COMPLETED",
            "VIBRATE",
            "POST_NOTIFICATIONS",
        ],
    },
    web: {
        favicon: "./assets/images/favicon.png",
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
            // Set EXPO_PUBLIC_EAS_PROJECT_ID in .env (local) or as a CI secret.
            projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
        },
        router: {
            origin: false,
        },
    },
};

module.exports = config;
