import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      maxWidth: {
        "8xl": "1485px",
      },
      colors: {
        yer: {
          green: {
            500: "#00ac22",
            600: "#00851a",
          },
          blue: {
            400: "#4287f5",
            500: "#2c68c7",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
