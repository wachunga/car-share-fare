const serve = require('rollup-plugin-serve');
// const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config, options) {
    if (options.writeMeta) {
      // only add the first time to avoid EADDRINUSE
      config.plugins.push(
        serve({
          open: true,
          contentBase: 'dist',
        })
        // TODO: add copy of index etc (blocked by https://github.com/jaredpalmer/tsdx/pull/208)
        // copy({
        //   targets: [
        //     { src: 'www/**/*', dest: 'dist' },
        //   ],
        //   verbose: true,
        //   copyOnce: true,
        // })
      );
    }
    return config;
  },
};
