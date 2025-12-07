/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                beige: {
                    50: '#fdfbf7',
                    100: '#f7f3ec', // Main bg?
                    200: '#efe5d5',
                    300: '#e0cdaf',
                    400: '#d2b589',
                    500: '#c59d67', // Buttons?
                    600: '#ba8550',
                    700: '#9a6b42',
                    800: '#7f583b',
                    900: '#674833',
                },
                stone: {
                    50: '#fafaf9',
                    100: '#f5f5f4', // Card bg
                    800: '#292524', // Text
                    900: '#1c1917',
                }
            },
            fontFamily: {
                sans: ['Space Grotesk', 'Outfit', 'sans-serif'], // Fallback chain
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem', // Super soft corners
            }
        },
    },
    plugins: [],
}
