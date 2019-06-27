const webpack = require('webpack');
const {
  resolve
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {
  const addPlugin = (add, plugin) => add ? plugin : undefined;
  const ifProd = plugin => addPlugin(env.prod, plugin);
  const removeEmpty = array => array.filter(i => !!i);

  return {
    mode: env.prod ? 'production' : 'development',
    entry: {
      'app': './src/app.js'
    },
    output: {
      filename: '[name].[hash].js',
      path: resolve(__dirname, './dist'),
      pathinfo: !env.prod
    },
    devtool: env.prod ? 'source-map' : 'eval-source-map',
    bail: env.prod,
    module: {
      rules: [{
          test: /\.js?$/,
          exclude: /(node_modules)/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['syntax-dynamic-import', '@babel/plugin-transform-runtime']
            }
          }]
        },
        {
          test: /\.woff$/,
          loader: 'url-loader?limit=0&mimetype=application/font-woff'
        },
        {
          test: /\.ttf$/,
          loader: 'url-loader?limit=0&mimetype=application/octet-stream'
        },
        {
          test: /\.eot$/,
          loader: 'url-loader?limit=0&mimetype=application/vnd.ms-fontobject'
        },
        {
          test: /\.svg$/,
          loader: 'url-loader?limit=0&mimetype=image/svg+xml'
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          loader: 'style-loader!css-loader!less-loader'
        }
      ]
    },
    devServer: {
      compress: true,
      https: true,
      hot: true,
      inline: true,
      open: true
    },
    plugins: removeEmpty([
      new CleanWebpackPlugin({
        verbose: true,
        dry: false
      }),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: resolve(__dirname, './dist/index.html')
      }),
      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true
      })),
      ifProd(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: 'production'
        }
      })),
      ifProd(new CompressionPlugin({
        filename: '[path].gz[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
        compressionOptions: {
          numiterations: 15,
          level: 9
        },
        algorithm: 'gzip'
      })),
      ifProd(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html'
      }))
    ]),
    watch: false,
    resolve: {
      extensions: ['.js']
    },
    externals: ['react/lib/ExecutionEnvironment', 'react/lib/ReactContext', 'react/addons']
  }
}
