const fs = require('fs');

const refPath = 'd:\\Nobilita3\\porcellana-nobilita\\public\\images\\technical data\\SVGs\\SVGs\\icons-13.svg';
const refContent = fs.readFileSync(refPath, 'utf8');
const refD = refContent.match(/<path[^>]+d="([^"]+)"/)[1];

const compPath = 'd:\\Nobilita3\\porcellana-nobilita\\components\\CoffeeSpillSVG.tsx';
const compContent = fs.readFileSync(compPath, 'utf8');

// Extract mainCompoundPath content
const compDMatch = compContent.match(/const mainCompoundPath = `([^`]+)`/);
if (!compDMatch) {
  console.log("Could not find mainCompoundPath in component file");
  process.exit(1);
}
const compD = compDMatch[1].replace(/\s/g, ''); // strip any formatting whitespace
const refDNormalized = refD.replace(/\s/g, '');

if (compD === refDNormalized) {
  console.log("SUCCESS: Path strings are exactly identical!");
} else {
  console.log("WARNING: Path strings differ!");
  console.log(`Reference length: ${refDNormalized.length}`);
  console.log(`Component length: ${compD.length}`);
  
  // Find first difference
  let diffIndex = -1;
  for (let i = 0; i < Math.min(refDNormalized.length, compD.length); i++) {
    if (refDNormalized[i] !== compD[i]) {
      diffIndex = i;
      break;
    }
  }
  if (diffIndex !== -1) {
    console.log(`First difference at index ${diffIndex}:`);
    console.log(`  Ref:  ...${refDNormalized.substring(diffIndex - 20, diffIndex + 20)}...`);
    console.log(`  Comp: ...${compD.substring(diffIndex - 20, diffIndex + 20)}...`);
  }
}
