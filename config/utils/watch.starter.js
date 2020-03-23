var Q = require('q');
var webpack = require('webpack');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');

var statsOptions = {
    'colors': true,
    'modules': false,
    'chunks': false,
    'exclude': ['node_modules']
};
var watchOptions = { ignored: /node_modules/ }

module.exports = function (webpackConfig) {
    var deferred = Q.defer();

    function webpackCallback(err, stats) {
        // print build stats and errors
        console.log(stats.toString(statsOptions));
        if (stats.hasErrors()) {
            deferred.reject(err);
        }
        deferred.resolve();
    };

    var compiler = webpack(webpackConfig);
    compiler.apply(new ProgressPlugin(function (percentage, msg, current, active, modulepath) {
        if (process.stdout.isTTY && percentage < 1) {
          process.stdout.cursorTo(0)
          modulepath = modulepath ? ' …' + modulepath.substr(modulepath.length - 30) : ''
          current = current ? ' ' + current : ''
          active = active ? ' ' + active : ''
          process.stdout.write((percentage * 100).toFixed(0) + '% ' + msg + current + active + modulepath + ' ')
          process.stdout.clearLine(1)
        } else if (percentage === 1) {
          process.stdout.write('\n')
          console.log('webpack: done.')
        }
      }));
    compiler.watch(watchOptions, webpackCallback);

    return deferred.promise;
}
