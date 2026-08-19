const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', '..', 'public', 'images', 'svg', 'NOBILITA House.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Find all paths in the SVG
const pathRegex = /<path[^>]*d="([^"]+)"[^>]*>/g;
let match;
const allPaths = [];

while ((match = pathRegex.exec(svgContent)) !== null) {
  allPaths.push(match[1]);
}

console.log(`Total paths found: ${allPaths.length}`);

// The second path (index 4 in the document, or let's find the long one)
// Let's print out the length of each path d attribute to identify the big one
allPaths.forEach((d, idx) => {
  console.log(`Path ${idx}: length = ${d.length}`);
});

// Let's take the big path (which should be index 4 or similar)
const bigPathIdx = allPaths.findIndex(d => d.length > 5000);
if (bigPathIdx !== -1) {
  const bigPathD = allPaths[bigPathIdx];
  // Split on 'M' (but keep the 'M')
  // We can do this by splitting on /(?=M)/
  const subpaths = bigPathD.split(/(?=M)/g).map(s => s.trim()).filter(Boolean);
  console.log(`Big path split into ${subpaths.length} subpaths`);
  
  // Save the subpaths to a JSON file so we can read/use them
  fs.writeFileSync(path.join(__dirname, 'subpaths.json'), JSON.stringify(subpaths, null, 2));
  console.log('Saved subpaths to subpaths.json');
} else {
  console.log('Could not find the big path');
}
