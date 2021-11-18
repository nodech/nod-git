#!/usr/bin/env node

'use strict';

const GH_API = require('../lib/gh-api');
const assert = require('assert');
const brq = require('brq');
const path = require('path');
const {question, NError} = require('../lib/utils');
const {getConfigs, HOME} = require('../lib/configs');

const cfg = getConfigs({
  file: path.join(HOME, '.gh_cfg'),
  argv: true,
  env: true
}, {
  alias: {
    'o': 'owner',
    'r': 'repo'
  }
});

const auth = {
  username: cfg.str('ghuser'),
  password: cfg.str('ghkey')
};

const owner = cfg.str('owner');
const repo = cfg.str('repo');
const action = cfg.str(0, 'help');


(async () => {
  switch (action) {
    case 'help': {
      help();
      break;
    }
    case 'list': {
      check(owner, repo);
      const res = await brq(GH_API.listLabels(owner, repo));
      console.log(JSON.stringify(res.json()));
      break;
    }
    case 'delete': {
      check(owner, repo);
      const labels = cfg.argv.slice(1);

      if (labels.length === 0)
        throw new NError('Labels not passed.');

      const res = await question(
        `Deleting labels: \n${labels.join(', ')}\nAre you sure ? (y/n) `
      );

      if (res !== 'y') {
        console.log('Aborted.');
        break;
      }

      await removeLabels(owner, repo, labels);

      break;
    }

    case 'deleteall': {
      check(owner, repo);
      const labelList = await brq(GH_API.listLabels(owner, repo));
      const labelNames = labelList.json().map(l => l.name);

      const res = await question(
        `Deleting labels: \n${labelNames.join(', ')}\nAre you sure ? (y/n) `
      );

      if (res !== 'y') {
        console.log('Aborted.');
        break;
      }

      await removeLabels(owner, repo, labelNames);
      break;
    }
  }

})().catch((e) => {
  if (e instanceof NError) {
    console.error('Error:', e.message);
    process.exit(1);
  }

  throw e;
});

function help() {
  console.log(
`Usage: github-labels.js [options] action [args]
Actions:
  help  - show this help
  list  - list project labels (dump)
  delete label-name... - delete project labels
  deleteall - delete all project labels
  add - ...
Options:
  -o, --owner=name - owner of the repo
  -r, --repo=repo - repo
`
  )
}

function check(owner, repo) {
  if (!owner || !repo)
    throw new NError('Could not find either owner or the repo.');
}

async function removeLabels(owner, repo, labels) {
  for (const label of labels) {
    const params = {
      ...auth,
      ...GH_API.removeLabel(owner, repo, label)
    };

    const res = await brq(params);

    if (res.statusCode === 204) {
      console.log(`Removed: ${label}.`);
    } else {
      console.log(`Failed to remove "${label}": ${res.json().message}.`);
    }
  }
}
