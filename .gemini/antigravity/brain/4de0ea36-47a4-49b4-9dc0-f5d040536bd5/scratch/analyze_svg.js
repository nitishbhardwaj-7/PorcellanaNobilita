const fs = require('fs');
const path = require('path');

const filePath = 'd:\\Nobilita3\\porcellana-nobilita\\public\\images\\technical data\\SVGs\\SVGs\\icons-13.svg';
const svgContent = fs.readFileSync(filePath, 'utf8');

// Extract the path 'd' attribute
const pathMatch = svgContent.match(/<path[^>]+d="([^"]+)"/);
if (!pathMatch) {
  console.log("No path found");
  process.exit(1);
}

const d = pathMatch[1];
const subpaths = d.split(/(?=M)/g);

console.log(`Total subpaths: ${subpaths.length}`);
subpaths.forEach((sub, i) => {
  console.log(`Subpath ${i}: length=${sub.length}, start=${sub.substring(0, 30)}...`);
});
