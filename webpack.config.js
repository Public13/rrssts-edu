const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    "main": ["whatwg-fetch", path.resolve(__dirname, "src", "index.js")],
  },
  output: {
    path: path.resolve(__dirname, "build", "distribution"),
    publicPath: "",
    filename: "script/[name].[hash].bundle.js",
    chunkFilename: "script/[id].[name].[hash].bundle.js",
    globalObject: "this",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      filename: "index.html",
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: false,
              attributes: {
                list: [
                  {
                    tag: "link",
                    attribute: "href",
                    type: "src",
                  },
                ],
              },
            },
          },
        ],
      },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    historyApiFallback: true,
    port: 3000,
    proxy: {
      "/proxy": {
        target: "http://127.0.0.1:9000",
        pathRewrite: {"^/proxy": ""},
      },
    },
  },
}
