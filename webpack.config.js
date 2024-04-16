const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    const isProd = argv.mode === "production";
    return {
        entry: "./src/index.ts",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "app.[chunkhash].js",
        },
        devtool: isProd ? undefined : "inline-source-map",
        devServer: {
            watchFiles: ["src/*.css"],
            hot: false,
            liveReload: true,
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
                {
                    test: /\.ts?$/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            onlyCompileBundledFiles: true,
                        },
                    },
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "public/index.html",
            }),
            new webpack.DefinePlugin({
                ISOLATED: argv.env.isolated,
            }),
            new MiniCssExtractPlugin({
                filename: "styles.[chunkhash].css",
            }),
            isProd ? new CleanWebpackPlugin() : undefined,
        ].filter((x) => x),
    };
};
