const fs = require('fs');
const yaml = require('js-yaml');
const tsConfigProvider = require("./ts.config.provider.js");
const extendify = require('extendify');
extend = extendify({
    inPlace: false,
    isDeep: true
});

const defaultPropsFilePath = 'profiles/properties/default.properties.yaml';
const envPropsFilePath = 'profiles/properties/env.properties.yaml';

function loadWebpackConfig(env) {
    var props = loadProps(env);
    var buildProps = props.BUILD;
    var appProps = props.APP;

    return loadTsConfig(appProps, buildProps);
}

function loadTsConfig(appProps, buildProps) {
    var tsConfig = extend({}, tsConfigProvider(appProps, buildProps));
    return tsConfig;
}

function loadProps(env) {
    var defaultProps = yaml.safeLoad(fs.readFileSync(defaultPropsFilePath, 'utf8'));
    var envProps = yaml.safeLoad(fs.readFileSync(envPropsFilePath, 'utf8'));
    var targetEnv = env ? env.toUpperCase() : null;
    var result = defaultProps;
    if (targetEnv){
        result = extend(defaultProps, envProps[targetEnv]);
    }
    return result;
}

module.exports = { loadWebpackConfig: loadWebpackConfig, loadProps: loadProps };
