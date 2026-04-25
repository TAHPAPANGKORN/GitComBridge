import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        github: {
          bg: "#0d1117",
          border: "#30363d",
          text: "#c9d1d9",
        },
        gitlab: {
          purple: "#6b4fbb",
          orange: "#e24329",
        },
      },
      backgroundImage: {
        "gitlab-gradient": "linear-gradient(135deg, #6b4fbb 0%, #e24329 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
