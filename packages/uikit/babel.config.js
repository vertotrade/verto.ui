module.exports = {
  presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
  plugins: ["@vanilla-extract/babel-plugin", "babel-plugin-styled-components"],
};
