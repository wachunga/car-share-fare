const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      copy({
        targets: [{ src: 'www/**/*', dest: 'dist' }],
        verbose: true,
        copyOnce: true,
      })
    );
    return config;
  },
};
