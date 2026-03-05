/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        {
            pattern: /^bg-(rose|sky|amber|emerald|blue|green|red|yellow|purple|indigo|pink|orange|teal|cyan|slate|gray|zinc)-(100|200|300|400|500|600|700)$/
        }
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
