// Polyfill global keys for react-native-reanimated on web
// This must run before any reanimated modules are evaluated

// @ts-ignore
global.__reanimatedLoggerConfig = {
  level: 0,
  strict: false,
};

// @ts-ignore
global.global = global;
