var watchStarter = require('./utils/watch.starter.js');
var webpackConfig = require('./webpack.config.js');
var bs = require("browser-sync").create();
var ConfigLoader = require("./utils/config.loader");
var config = ConfigLoader.loadProps(process.env.npm_config_env, process.env.npm_config_cc);
var nodeSass = require('./sass.compile.js');

var bsOptions = {
    host: 'localhost',
    port: 3000,
    server: { baseDir: [config.APP.DIST] },
    startPath: 'index.html',
    files: [
        config.APP.DIST + '/**/*',
        {
            match: ["src/scss/**/*.scss"],
            fn:    function (event, file) {
                if (event === "change") {
                    nodeSass("app");
                }
            }
        }
    ],
    reloadThrottle: 200
};

watchStarter(webpackConfig).then(
    () => {
        bs.init(bsOptions);
    }
)
