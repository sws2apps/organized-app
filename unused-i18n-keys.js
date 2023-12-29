import fs from 'fs';
import glob from 'glob';

// Step 1: Extract keys from translation files
let translationKeys = [];

// Use glob to get all .json files in the translations directory
let translationFiles = glob.sync('src/shared/locales/en/*.json');

// Exclude files based on filename
const excludedFiles = ['source.json', 'ui.json']; // replace with your filenames
translationFiles = translationFiles.filter((file) => !excludedFiles.includes(file.split('/').pop()));

translationFiles.forEach((file) => {
  const translationFile = fs.readFileSync(file);
  translationKeys = [...translationKeys, ...Object.keys(JSON.parse(translationFile))];
});

// Step 2: Parse source code to find used keys
let usedKeys = [];

// Use glob to get all .js and .jsx files in the project directory
const files = glob.sync('src/v3/**/*.+(js|jsx|ts|tsx)');

files.forEach((file) => {
  const sourceCode = fs.readFileSync(file, 'utf-8');
  translationKeys.forEach((key) => {
    if (sourceCode.includes(key)) {
      usedKeys.push(key);
    }
  });
});

// Step 3: Find unused keys
const unusedKeys = translationKeys.filter((key) => !usedKeys.includes(key));

console.log('Unused keys:', JSON.stringify(unusedKeys));
