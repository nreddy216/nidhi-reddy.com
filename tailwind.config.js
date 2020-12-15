module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: [
      "./src/**/*.js",
      "./src/**/**/*.js",
      "./src/**/**/**/*.js",
      "./src/pages/*.tsx",
    ],
  },
  theme: {
    extend: {},
    listStyleType: {
      circle: "circle",
      disc: "disc",
      decimal: "decimal",
    },
  },
  variants: {},
  plugins: [],
};
