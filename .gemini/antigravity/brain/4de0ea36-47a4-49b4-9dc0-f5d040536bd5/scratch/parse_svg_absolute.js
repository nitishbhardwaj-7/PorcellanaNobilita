const fs = require('fs');

function parsePathToAbsolute(pathStr) {
  // Regex to match commands and numbers
  const commandRegex = /([a-df-zDF-Z])|([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/g;
  let match;
  const tokens = [];
  
  while ((match = commandRegex.exec(pathStr)) !== null) {
    if (match[1]) {
      tokens.push({ type: 'command', value: match[1] });
    } else if (match[2]) {
      tokens.push({ type: 'number', value: parseFloat(match[2]) });
    }
  }

  let curX = 0;
  let curY = 0;
  let startX = 0;
  let startY = 0;
  let points = [];

  let i = 0;
  let curCmd = '';

  while (i < tokens.length) {
    if (tokens[i].type === 'command') {
      curCmd = tokens[i].value;
      i++;
    }

    // Parse coordinates based on command
    if (curCmd === 'M' || curCmd === 'm') {
      const x = tokens[i++].value;
      const y = tokens[i++].value;
      if (curCmd === 'M') {
        curX = x;
        curY = y;
      } else {
        curX += x;
        curY += y;
      }
      startX = curX;
      startY = curY;
      points.push([curX, curY]);
      // Implicit lineto if multiple coordinate pairs
      curCmd = curCmd === 'M' ? 'L' : 'l';
    } else if (curCmd === 'L' || curCmd === 'l') {
      const x = tokens[i++].value;
      const y = tokens[i++].value;
      if (curCmd === 'L') {
        curX = x;
        curY = y;
      } else {
        curX += x;
        curY += y;
      }
      points.push([curX, curY]);
    } else if (curCmd === 'H' || curCmd === 'h') {
      const val = tokens[i++].value;
      if (curCmd === 'H') {
        curX = val;
      } else {
        curX += val;
      }
      points.push([curX, curY]);
    } else if (curCmd === 'V' || curCmd === 'v') {
      const val = tokens[i++].value;
      if (curCmd === 'V') {
        curY = val;
      } else {
        curY += val;
      }
      points.push([curX, curY]);
    } else if (curCmd === 'C' || curCmd === 'c') {
      const x1 = tokens[i++].value;
      const y1 = tokens[i++].value;
      const x2 = tokens[i++].value;
      const y2 = tokens[i++].value;
      const x = tokens[i++].value;
      const y = tokens[i++].value;
      if (curCmd === 'C') {
        curX = x;
        curY = y;
      } else {
        curX += x;
        curY += y;
      }
      points.push([curX, curY]);
    } else if (curCmd === 'S' || curCmd === 's') {
      const x2 = tokens[i++].value;
      const y2 = tokens[i++].value;
      const x = tokens[i++].value;
      const y = tokens[i++].value;
      if (curCmd === 'S') {
        curX = x;
        curY = y;
      } else {
        curX += x;
        curY += y;
      }
      points.push([curX, curY]);
    } else if (curCmd === 'Q' || curCmd === 'q') {
      const x1 = tokens[i++].value;
      const y1 = tokens[i++].value;
      const x = tokens[i++].value;
      const y = tokens[i++].value;
      if (curCmd === 'Q') {
        curX = x;
        curY = y;
      } else {
        curX += x;
        curY += y;
      }
      points.push([curX, curY]);
    } else if (curCmd === 'T' || curCmd === 't') {
      const x = tokens[i++].value;
      const y = tokens[i++].value;
      if (curCmd === 'T') {
        curX = x;
        curY = y;
      } else {
        curX += x;
        curY += y;
      }
      points.push([curX, curY]);
    } else if (curCmd === 'Z' || curCmd === 'z') {
      curX = startX;
      curY = startY;
      points.push([curX, curY]);
      // If there are no more tokens, command can end
      if (i < tokens.length && tokens[i].type === 'number') {
        // SVG spec allows implicit move/line after Z sometimes, but usually there's another command
      }
    } else {
      // Unknown command or spacer, just skip token to avoid infinite loop
      i++;
    }
  }

  return points;
}

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
  const points = parsePathToAbsolute(sub);
  if (points.length === 0) {
    console.log(`Subpath ${index}: empty`);
    return;
  }

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  points.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  console.log(`Subpath ${index}:`);
  console.log(`  Bounds: X [${minX.toFixed(2)}, ${maxX.toFixed(2)}] (width ${(maxX-minX).toFixed(2)})`);
  console.log(`          Y [${minY.toFixed(2)}, ${maxY.toFixed(2)}] (height ${(maxY-minY).toFixed(2)})`);
  console.log(`  Points: ${points.length}`);
});
