var ConfigLoader = require("./utils/config.loader");
module.exports = ConfigLoader.loadWebpackConfig(process.env.npm_config_env);
