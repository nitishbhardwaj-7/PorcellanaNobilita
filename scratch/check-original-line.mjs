import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11.png';
    const image = await Jimp.read(imgPath);
    
    let minY = image.height;
    let maxY = 0;
    let lineX = 162;
    
    for (let y = 0; y < image.height; y++) {
      const c = image.getPixelColor(lineX, y);
      const alpha = c & 0xff;
      const r = (c >> 24) & 0xff;
      const g = (c >> 16) & 0xff;
      const b = (c >> 8) & 0xff;
      if (alpha > 100 && r > 200 && g > 200 && b > 200) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    
    console.log(`Original vertical line: Y from ${minY} to ${maxY} (total length: ${maxY - minY}px)`);
    
    // Scan for slab connection rows Y
    let topSlabY = -1;
    for (let y = minY; y < image.height; y++) {
      const c = image.getPixelColor(180, y);
      const r = (c >> 24) & 0xff;
      const alpha = c & 0xff;
      if (alpha > 100 && r > 200) {
        topSlabY = y;
        break;
      }
    }
    
    let bottomSlabY = -1;
    for (let y = maxY; y > 0; y--) {
      const c = image.getPixelColor(180, y);
      const r = (c >> 24) & 0xff;
      const alpha = c & 0xff;
      if (alpha > 100 && r > 200) {
        bottomSlabY = y;
        break;
      }
    }
    
    console.log(`Top slab top edge at X=180 is at Y = ${topSlabY}`);
    console.log(`Bottom slab bottom edge at X=180 is at Y = ${bottomSlabY}`);
    
    const spaceAtTop = topSlabY - minY;
    const spaceAtBottom = maxY - bottomSlabY;
    console.log(`Original space at top: ${spaceAtTop}px`);
    console.log(`Original space at bottom: ${spaceAtBottom}px`);
  } catch (err) {
    console.error(err);
  }
}

run();
