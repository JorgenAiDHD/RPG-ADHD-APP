// Konfiguracja PostCSS, niezbędna dla Tailwind CSS
module.exports = {
  plugins: {
    tailwindcss: {
      config: './tailwind.config.cjs', // Explicit path to the CJS config
    },
    autoprefixer: {},
  },
};
