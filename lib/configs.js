'use strict';

const os = require('os');
const fs = require('fs');
const Config = require('bcfg');

exports.HOME = os.homedir ? os.homedir() : '/';

exports.getConfigs = (options, configs) => {
  const cfg = new Config('nod-git', configs);

  if (options) {
    cfg.inject(options);
    cfg.load(options);
  }

  if (options && options.file) {
    const json = JSON.parse(fs.readFileSync(options.file).toString());
    cfg.inject(json);
  }

  return cfg;
};
