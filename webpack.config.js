const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const cssModulesNameFormat = '[name]__[local]___[hash:base64:5]'

const clientConfig = {
  name: 'client',
  entry: './src/browser.tsx',
  output: {
    filename: 'bundle.[chunkhash].js',
    path: path.resolve(__dirname, 'build/public'),
  },
  devtool: 'source-map',
  cache: true,
  resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: cssModulesNameFormat,
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, 'postcss.config.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          reportFiles: ['src/**/*.{ts,tsx}'],
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
      {
        test: /\.ttf$/,
        loader: 'file-loader',
        options: {
          name: '[name]_[hash].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new ManifestPlugin({
      fileName: path.resolve(__dirname, 'manifest.json'),
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[chunkhash].css',
    }),
  ],
}

const serverConfig = {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    nodeEnv: false,
  },
  devtool: 'source-map',
  cache: true,
  resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          onlyLocals: true,
          modules: {
            localIdentName: cssModulesNameFormat,
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          reportFiles: ['src/**/*.{ts,tsx}'],
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
    ],
  },
  plugins: [new HardSourceWebpackPlugin()],
}

module.exports = [clientConfig, serverConfig]
