const fs = require('fs');
const path = require('path');

const svgDir = 'd:\\Nobilita3\\porcellana-nobilita\\public\\images\\technical data\\SVGs\\SVGs';
const files = fs.readdirSync(svgDir);

files.forEach(file => {
  if (file.endsWith('.svg')) {
    const filePath = path.join(svgDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const pathCount = (content.match(/<path/g) || []).length;
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
    console.log(`File: ${file}`);
    console.log(`  Path count: ${pathCount}`);
    console.log(`  viewBox: ${viewBoxMatch ? viewBoxMatch[1] : 'none'}`);
    if (styleMatch) {
      console.log(`  Style: ${styleMatch[1].replace(/\s+/g, ' ').trim()}`);
    }
  }
});
