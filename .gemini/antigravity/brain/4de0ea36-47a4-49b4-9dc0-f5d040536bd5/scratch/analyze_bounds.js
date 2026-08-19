const fs = require('fs');

const filePath = 'd:\\Nobilita3\\porcellana-nobilita\\public\\images\\technical data\\SVGs\\SVGs\\icons-13.svg';
const svgContent = fs.readFileSync(filePath, 'utf8');

const pathMatch = svgContent.match(/<path[^>]+d="([^"]+)"/);
if (!pathMatch) {
  console.log("No path found");
  process.exit(1);
}

const d = pathMatch[1];
const subpaths = d.split(/(?=M)/g);

subpaths.forEach((sub, index) => {
  // Simple regex parser to extract coordinates from path
  const matches = sub.match(/[-+]?[0-9]*\.?[0-9]+/g);
  if (!matches) {
    console.log(`Subpath ${index}: No coordinates`);
    return;
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  // We parse pairs of numbers (coordinates)
  for (let i = 0; i < matches.length; i += 2) {
    if (i + 1 >= matches.length) break;
    const x = parseFloat(matches[i]);
    const y = parseFloat(matches[i+1]);
    if (!isNaN(x) && !isNaN(y)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  console.log(`Subpath ${index}:`);
  console.log(`  Bounds: X [${minX.toFixed(2)}, ${maxX.toFixed(2)}] (width ${(maxX-minX).toFixed(2)})`);
  console.log(`          Y [${minY.toFixed(2)}, ${maxY.toFixed(2)}] (height ${(maxY-minY).toFixed(2)})`);
  console.log(`  Start:  ${sub.substring(0, 40)}...`);
});
