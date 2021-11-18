'use strict';

const util = require('util');
const readline = require('readline');

exports.question = async (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const rlQuestion = util.promisify(rl.question).bind(rl);
  const res = await rlQuestion(question);

  rl.close();
  return res;
};

exports.NError = class NError extends Error {
  constructor(...args) {
    super(...args);
  }
};
