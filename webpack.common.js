const path = require("path");
module.exports = {
    mode: "development",
    entry: "./src/app/App.tsx",
    devtool: "inline-source-map",
    target: "electron-renderer",
    module: {
        rules: [{
            // Compile our .tsx files
            test: /\.tsx$/,
            exclude: /node_modules/,
            use: [{ 
                // Compile .tsx -> .js (with JSX)
                loader: "ts-loader"
            }, { 
                // Compile .js (with JSX) -> Plain .js
                loader: 'babel-loader',
                options: {
                    presets: [[
                    '@babel/preset-env', {
                        targets: {
                        esmodules: true
                        }
                    }],
                    '@babel/preset-react']
                }
            }]
        }]
    },
    resolve: { // Resolve any .js or .tsx modules referenced in index.tsx and encountered files
        extensions: [".js", ".tsx"]
    },
    output: { // Output to /build/app/app.js
        filename: "app.js",
        path: path.resolve(__dirname, "build", "app")
    }
}