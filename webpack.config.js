const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const dist = path.resolve(__dirname, 'demo/dist');
const demo = path.resolve(__dirname, 'demo/src');
const src = path.resolve(__dirname, 'src');
const favicons = path.resolve(__dirname, 'demo/src/favicons');

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
    clean: true,
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

    new CopyPlugin({
      patterns: [
        { from: favicons, to: dist },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'simple-pug-loader',
        options: {
          pretty: true,
        },
      },
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};
