const fs = require('fs');
const path = require('path');

export function dumpJson(name, data) {
    const dir = path.resolve(__dirname, 'logs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);          
  
    const file = path.join(dir, `${name}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`🔍  Saved JSON to ${file}`);
}