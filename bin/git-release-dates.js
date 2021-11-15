#!/usr/bin/env node
'use strict';

// const readline = require('readline');
const execSync = require('child_process').execSync;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   terminal: true
// });

// const lines = [];
// rl.on('line', i => lines.push(i));
// rl.on('close', printReleases)
//

const lines = execSync(
  'git log --tags --simplify-by-decoration --pretty="format:%ci %d" | sort'
).toString().split(/\n/)

printReleases();

function parseData(line) {
  const regex = /^(\d{4})-(\d{2})-(\d{2})[^(]+\(tag: (.+)\)$/
  const matches = line.match(regex);

  if (!matches)
    return null;

  const year = parseInt(matches[1], 10);
  const month = parseInt(matches[2], 10);
  const day = parseInt(matches[3], 10);
  const version = matches[4];

  return {year, month, day, version};
}

function byMonth(p, c) {
  const key = `${c.year} ${fmonth(c.month)} `
  if (p.has(key))
    p.get(key).push(c);
  else
    p.set(key, [c]);

  return p;
}

function printReleases() {
  const byMonths = lines
    .filter(i => i != '')
    .map(parseData)
    .filter(i => i != null)
    .reduce(byMonth, new Map());

  if (byMonths.size === 0) {
    console.log('Releases not found');
    return;
  }

  for (const [m, data] of byMonths.entries()) {
    console.log(`${m}`);

    for (const d of data)
      console.log(`  ${fday(d.day)} - ${d.version}`);
  }
}

function fday(d) {
  if (d < 10)
    return ` ${d}`;

  return `${d}`;
}

function fmonth(m) {
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return MONTHS[m - 1];
}
