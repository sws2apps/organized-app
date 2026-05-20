const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modified = 0;

walkDir('src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const regex = /buildPersonFullname\(\s*(\w+(?:\.person_data|\.speaker_data)?)\.person_lastname\.value,\s*(\w+(?:\.person_data|\.speaker_data)?)\.person_firstname\.value,\s*(\w+)\s*\)/g;
    
    content = content.replace(regex, (match, lObj, fObj, opt) => {
      if (lObj === fObj) {
        return `buildPersonFullname(\n            ${lObj}.person_lastname.value,\n            ${fObj}.person_firstname.value,\n            ${opt},\n            ${lObj}.person_middlename?.value\n          )`;
      }
      return match;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      modified++;
      console.log('Modified: ' + filePath);
    }
  }
});

console.log('Total replaced: ' + modified);
