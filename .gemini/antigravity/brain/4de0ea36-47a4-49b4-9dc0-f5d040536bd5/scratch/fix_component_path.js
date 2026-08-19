const fs = require('fs');

const refPath = 'd:\\Nobilita3\\porcellana-nobilita\\public\\images\\technical data\\SVGs\\SVGs\\icons-13.svg';
const refContent = fs.readFileSync(refPath, 'utf8');
const refD = refContent.match(/<path[^>]+d="([^"]+)"/)[1];

const compPath = 'd:\\Nobilita3\\porcellana-nobilita\\components\\CoffeeSpillSVG.tsx';
let compContent = fs.readFileSync(compPath, 'utf8');

// Replace the string value of mainCompoundPath
const newCompContent = compContent.replace(/const mainCompoundPath = `[^`]+`/, `const mainCompoundPath = \`${refD}\``);

fs.writeFileSync(compPath, newCompContent, 'utf8');
console.log("Successfully synced mainCompoundPath with icons-13.svg reference!");
