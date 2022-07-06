const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dist = path.resolve(__dirname, 'demo/dist');
const demo = path.resolve(__dirname, 'demo/src');
const src = path.resolve(__dirname, 'src');

module.exports = {
  mode: 'development',

  entry: {
    index: {
      import: './demo/src/index.ts',
      dependOn: 'jquery',
    },
    jquery: 'jquery',
  },

  output: {
    path: dist,
  },

  devServer: {
    open: true,
    hot: true,
    static: {
      directory: dist,
    },
    watchFiles: {
      paths: [src, demo],
    },
    host: 'localhost',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/src/index.pug',
      filename: './index.html',
      inject: 'body',
    }),

    new MiniCssExtractPlugin({ filename: '[name].css' }),

  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'simple-pug-loader',
      },
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};
