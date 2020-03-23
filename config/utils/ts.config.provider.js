const StringReplacePlugin = require("string-replace-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Uglify Js Plugin Definition
var uglifyJsPlugin = function (buildProps) {
    return new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
            screw_ie8: true,
            keep_fnames: true
        },
        compress: {
            screw_ie8: true,
            warnings: false,
            drop_console: buildProps.DROP_CONSOLE
        },
        comments: false,
        sourceMap: buildProps.SOURCE_MAP
    })
};

function getVendorEntry(buildProps) {
    var result = '';
    if (buildProps.USE_AOT) {
        result = './src/app/entrypoints/vendor-aot.ts';
    } else {
        result = './src/app/entrypoints/vendor.ts';
    }

    return result;
}


module.exports = function (appProps, buildProps) {
    var config = {
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [
                path.join(process.cwd(), './src/app'),
                'node_modules'
            ]
        },
        entry: {
            'app': './src/app/entrypoints/main.ts',
            'vendor': getVendorEntry(buildProps),
            'polyfills': './src/app/entrypoints/polyfills.ts'
        },
        output: {
            path: path.resolve(appProps.DIST),
            filename: 'build/[name].js',
            chunkFilename: '[name].chunk.js',
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: ["app", "vendor", "polyfills"],
                minChuncks: Infinity
            }),
            new StringReplacePlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: '!!handlebars-loader!src/index.html',
                inject: false,
                props: appProps
            }),
            new AngularCompilerPlugin({
                tsConfigPath: './tsconfig.json',
                skipCodeGeneration: !buildProps.USE_AOT
            })
        ],
        module: {
            exprContextCritical: false,
            rules: [
                { test: /assets.*\.js$/, loader: 'script-loader' },
                { test: /\.html$/, loader: 'raw-loader' },
                { test: /\.yaml$/, loader: 'json-loader!yaml-loader' },
                {
                    test: /app\.properties\.ts$/,
                    loader: StringReplacePlugin.replace({
                        replacements: [
                            {
                                pattern: /@@(\w*)/ig,
                                replacement: function (match, p1, offset, string) {
                                    return appProps[p1];
                                }
                            }
                        ]
                    })
                },
                {
                    test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                    use: [
                        {
                            loader: '@ngtools/webpack'
                        }
                    ]
                }
            ]
        }
    };

    if (buildProps.MINIFY) {
        config.plugins.push(uglifyJsPlugin(buildProps));
    }

    if (buildProps.ANALYZE_BUNDLE) {
        config.plugins.push(new BundleAnalyzerPlugin());
    }


    // Set devtool accordingly to build properties
    if (buildProps.SOURCE_MAP) {
        config.devtool = 'cheap-module-eval-source-map';
    }

    return config;
};
