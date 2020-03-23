const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const CleanCss = require('clean-css');
const ConfigLoader = require("./utils/config.loader");

const props = ConfigLoader.loadProps(process.env.npm_config_env);

const sassConfig = {
    entry: { app: './src/scss/app.scss', vendor: './src/scss/vendor.scss' },
    dist: props.APP.DIST + '/build/',
    outputSuffix: '.css'
}

const autoprefixerConfig = {
    browsers: [
        "Android 2.3",
        "Android >= 4",
        "Chrome >= 20",
        "Firefox >= 24",
        "Explorer >= 8",
        "iOS >= 6",
        "Opera >= 12",
        "Safari >= 6"
    ],
    excludeModules: [
        '@angular',
        'commonjs-proxy',
        'ionic-native',
        'rxjs',
        'zone.js'
      ]
};

var postcssConfig = [autoprefixer(autoprefixerConfig)];


function compile(targetEntry) {
    for (key in sassConfig.entry) {
        if(targetEntry && key != targetEntry)
            continue;
        let outputFilePath = sassConfig.dist + key + sassConfig.outputSuffix;
        sass.render({
            file: sassConfig.entry[key],
            includePaths: [
                'node_modules',
            ],
            outFile: outputFilePath,
        }, (err, result) => {
            if (err) {
                console.log(err.status);
                console.log(err.column);
                console.log(err.message);
                console.log(err.line);
                return;
            }
            postcss(postcssConfig)
                .process(result.css)
                .then(postResult => {
                    mkdirp(path.dirname(outputFilePath), (mkdirErr) => {
                        if (mkdirErr) {
                            console.log(mkdirErr);
                            return;
                        }
                        var resultCss = postResult.css;
                        if (props.BUILD.MINIFY) {
                            var output = new CleanCss().minify(resultCss);
                            resultCss = output.styles;
                        }
                        fs.writeFileSync(outputFilePath, resultCss);
                        console.log("\x1b[32m[sass-compile]\x1b[0m Emitted: \x1b[35m" + outputFilePath)
                        console.log("\x1b[32m[sass-compile]\x1b[0m Compiled: " + result.stats.entry + " in \x1b[1m"+ result.stats.duration + "\x1b[0m ms");
                    })
                });
        });
    }
}
if (require.main === module) {
    compile();
}
module.exports = compile;
