const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV || 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    'scripts/background.js': './src/scripts/background.js',
    'scripts/content.js': './src/scripts/content.js',
    'scripts/popup.js': './src/scripts/popup.js',
    'scripts/options.js': './src/scripts/options.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  
  plugins: [
    new EnvironmentPlugin({
      DEBUG: process.env.NODE_ENV === 'development'
    }),
    new CleanPlugin([path.resolve(__dirname, 'dist')]),
    new CopyPlugin([
      {
        from: 'src/images',
        to: 'images'
      },
      {
        from: 'src/pages',
        to: 'pages'
      },
      {
        from: 'src/styles',
        to: 'styles'
      },
      {
        from: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
        to: 'styles'
      },
      {
        from: 'node_modules/marked/marked.min.js',
        to: 'scripts'
      },
      {
        from: 'src/_locales',
        to: '_locales'
      },
      {
        from: 'src/manifest.json',
        to: 'manifest.json'
      }
    ]),
    process.env.NODE_ENV === 'production' &&
      new FileManagerPlugin({
        onEnd: [
          {
            archive: [
              {
                source: 'dist/',
                destination: `dist/chrome-pullrequest-templates.zip`
              }
            ]
          }
        ]
      })
  ].filter(Boolean)
};