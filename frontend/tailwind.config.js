/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        // 1. Suas Cores Personalizadas
        colors: {
          primary: "#ffffff",
          secondary: "#000000",
          softgray: "#f3f4f6",
        },
        // 2. Sua Animação Personalizada (Nome da classe: animate-float)
        animation: {
          float: "float 4s ease-in-out infinite",
        },
        // 3. Os Keyframes da animação
        keyframes: {
          float: {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-10px)" },
          },
        },
      },
    },
  plugins: [],
}

