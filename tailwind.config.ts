import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Noto Sans JP",
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Yu Gothic",
          "Meiryo",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        serif: [
          "Noto Serif JP",
          "Hiragino Mincho ProN",
          "Yu Mincho",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
