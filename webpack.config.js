const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/main.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash].js" : "[name].js",
      clean: false, // Не очищаем папку, чтобы не удалить CSS файлы
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new Dotenv({
        path: "./.env",
        safe: false,
        allowEmptyValues: true,
        systemvars: true,
        silent: false,
        defaults: false,
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "."), // Служим файлы из корня проекта
      },
      compress: true,
      port: 8080,
      hot: true,
      open: true,
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
  };
};
