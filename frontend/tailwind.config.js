/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        // 1. Suas Cores Personalizadas
        colors: {
          primary: "#ffffff",
          secondary: "#000000",
          softgray: "#f3f4f6",
          brand: {
              50: '#f0f9ff',  // Fundo muito claro
              100: '#e0f2fe', // Azul gelo
              500: '#0ea5e9', // Azul vibrante (botões)
              600: '#0284c7', // Azul hover
              900: '#0c4a6e', // Azul escuro (textos)
            }
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

