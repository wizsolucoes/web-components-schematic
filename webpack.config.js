const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");

const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, './tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "rural",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: "module" },
      name: "rural",
      filename: "remoteEntry.js",
      exposes: {
        './web-components': 'src/bootstrap.ts',
        './routes': 'src/app/routes.ts',
      },
      shared: share({
        "@angular/core": { requiredVersion: "auto" },
        "@angular/common": { requiredVersion: "auto" },
        "@angular/router": { requiredVersion: "auto" },
        "rxjs": { requiredVersion: "auto" },
        "@wizco/wizpro-tools": { requiredVersion: "auto" },
        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ]
};
