import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11_drawing.png';
    const image = await Jimp.read(imgPath);
    
    // Scan column x=180 to find active rows.
    // The top slab is drawn at the top, and bottom slab at the bottom.
    let activeRows = [];
    for (let y = 0; y < image.height; y++) {
      if ((image.getPixelColor(180, y) & 0xff) > 10) {
        activeRows.push(y);
      }
    }
    
    console.log(`Active rows at x=180: ${activeRows.length} pixels`);
    // Find clusters of active rows
    let clusters = [];
    let start = -1;
    for (let i = 0; i < activeRows.length; i++) {
      if (start === -1) {
        start = activeRows[i];
      }
      if (i === activeRows.length - 1 || activeRows[i + 1] - activeRows[i] > 10) {
        clusters.push([start, activeRows[i]]);
        start = -1;
      }
    }
    console.log('Slab vertical clusters at x=180:', clusters);
  } catch (err) {
    console.error(err);
  }
}

run();
