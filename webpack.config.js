const path = require('path');
const outputPath = path.resolve(__dirname, "public");
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser.js');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: `${outputPath}`
    },
    module: {
        rules: [{
            test: /\.ts/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, ],
    },
    devServer: {
        static: {
            directory: `${outputPath}`,
            staticOptions: {},
            // Don't be confused with `devMiddleware.publicPath`, it is `publicPath` for static directory
            // Can be:
            // publicPath: ['/static-public-path-one/', '/static-public-path-two/'],
            // Can be:
            // serveIndex: {} (options for the `serveIndex` option you can find https://github.com/expressjs/serve-index)
            serveIndex: true,
            // Can be:
            // watch: {} (options for the `watch` option you can find https://github.com/paulmillr/chokidar)
            watch: true,    // 変更した時自動でリロードされるか否か
        },
        open: true, // ブラウザを自動で開くか否か
        hot: true,  // 開発中にCSSとかを変更した時、リロードせずに更新するか否か
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            phaser: phaser,
        },
    }
};
