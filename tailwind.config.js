/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#10b981", // Emerald 500
                secondary: "#3b82f6", // Blue 500
                dark: "#18181b", // Zinc 900
                "dark-card": "#27272a", // Zinc 800
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
