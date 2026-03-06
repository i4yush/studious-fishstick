/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                gold: {
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                surface: {
                    DEFAULT: '#1a1a2e',
                    raised: '#16213e',
                    overlay: '#0f3460',
                },
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6',
            },
            fontFamily: {
                sans: ['Inter-Regular', 'sans-serif'],
                medium: ['Inter-Medium', 'sans-serif'],
                semibold: ['Inter-SemiBold', 'sans-serif'],
                bold: ['Inter-Bold', 'sans-serif'],
            },
            borderRadius: {
                xl: '16px',
                '2xl': '24px',
                '3xl': '32px',
            },
        },
    },
    plugins: [],
};
