let colors = {
  primary: "#cba6f7",
  secondary: "#74c7ec",
  accent: "#94e2d5",
  neutral: "#313244",
  "base-100": "#09090b",
  "base-200": "#111014",
  "base-300": "#18191e",
  info: "#74c7ec",
  success: "#a6e3a1",
  warning: "#f9e2af",
  error: "#f38ba8",
};

module.exports = {
  content: ["./**/*.{vue,css,html}"],

  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  theme: {
    extend: {
      colors: colors,
    },
  },
  daisyui: {
    themes: [
      "dark",
      {
        rachoon: colors,
      },
    ],
  },
};
