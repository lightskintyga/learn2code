export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                scratch: {
                    purple: '#855CD6',
                    'purple-dark': '#6D44C0',
                    blue: '#4C97FF',
                    'blue-dark': '#3373CC',
                    'blue-light': '#9ACDFF',
                    green: '#59C059',
                    'green-dark': '#389438',
                    yellow: '#FFBF00',
                    'yellow-dark': '#CC9900',
                    orange: '#FF8C1A',
                    'orange-dark': '#CF6D00',
                    red: '#FF6680',
                    'red-dark': '#CC3355',
                    cyan: '#5CB1D6',
                    'cyan-dark': '#2E8EB8',
                    'motion': '#4C97FF',
                    'looks': '#9966FF',
                    'sound': '#CF63CF',
                    'events': '#FFBF00',
                    'control': '#FFAB19',
                    'sensing': '#5CB1D6',
                    'operators': '#59C059',
                    'variables': '#FF8C1A',
                    'myblocks': '#FF6680',
                },
                ui: {
                    'bg': '#F9F9F9',
                    'primary': '#855CD6',
                    'secondary': '#4C97FF',
                    'header': '#855CD6',
                    'tab-active': '#FFFFFF',
                    'tab-inactive': '#E0D0F0',
                    'border': '#D9D9D9',
                    'text': '#575E75',
                    'text-light': '#8C8C8C',
                }
            },
            fontFamily: {
                sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
            },
            boxShadow: {
                'block': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                'sprite': '0 2px 4px rgba(0,0,0,0.1)',
            }
        },
    },
    plugins: [],
}