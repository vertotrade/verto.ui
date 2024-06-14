import VanillaExtractPlugin from '@vanilla-extract/webpack-plugin'

module.exports = {
  module: {
    rules: [
      {
        test: /\.css.ts$/,
        use: [
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [new VanillaExtractPlugin()],
  resolve: {
    extensions: ['.ts', '.js'],
  },
}
