module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/app/app.module.ts",
    output: {
      filename: "app.js"
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".commponent.ts"]
    },
    target: 'web',
    node: {
        fs: 'empty'
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: "ts-loader" }
      ]
    }
  };