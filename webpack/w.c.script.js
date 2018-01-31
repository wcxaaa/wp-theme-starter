const { resolve } = require("path");
 
let assetsBase = resolve(__dirname, "../assets");

let pages = ['entry', 'page-gaoxiao'];

let entry = {};

for (let page of pages) {
  entry[page] = [resolve(assetsBase, `./js/src/${page}.ts`)]
}

let scriptConfig = {

  entry: entry,

  resolve: {
    extensions: ['.ts', '.js']
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /(\.ts)$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: "tsconfig.json"
            }
          }
        ]
      }
    ]
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].[hash].chunk.js'
  }


};


module.exports = scriptConfig;