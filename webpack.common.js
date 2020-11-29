const path = require("path");
module.exports = {
    mode: "development",
    entry: "./src/app/App.tsx",
    devtool: "inline-source-map",
    target: "electron-renderer",
    module: {
        rules: [{
            // Turn all our .tsx into .js files
            test: /\.tsx$/,
            exclude: /node_modules/,
            use: [{ 
                // Compile .tsx -> .js (with JSX) -> Plain .js
                loader: "babel-loader",
                options: {
                    presets: [
                    "@babel/preset-typescript", [
                    "@babel/preset-env", {
                        targets: {
                        esmodules: true
                        }
                    }],
                    "@babel/preset-react"]
                }
            }]
        },{
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"]
        }]
    },
    resolve: { // Resolve any .js or .tsx modules referenced in index.tsx and encountered files
        extensions: [".js", ".tsx", ".css"]
    },
    output: { // Output to /build/app/app.js
        filename: "app.js",
        path: path.resolve(__dirname, "build", "app")
    }
}