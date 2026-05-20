const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

    const regex = /buildPersonFullname\(\s*([a-zA-Z0-9_]+(?:\.person_data|\.speaker_data)?)\.person_lastname\.value,\s*([a-zA-Z0-9_]+(?:\.person_data|\.speaker_data)?)\.person_firstname\.value,\s*([a-zA-Z0-9_]+)\s*\)/g;
    
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
