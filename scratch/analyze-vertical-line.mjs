import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11_drawing.png';
    const image = await Jimp.read(imgPath);
    
    // Find the Y coordinates of the vertical line.
    // The vertical line is at the minimum X coordinate. We know minX is around 161.
    // Let's check column x = 161.
    let minY = image.height;
    let maxY = 0;
    
    for (let y = 0; y < image.height; y++) {
      const color = image.getPixelColor(161, y);
      const alpha = color & 0xff;
      if (alpha > 10) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    
    console.log(`Vertical line on column 161 spans Y: from ${minY} to ${maxY}`);
    
    // Let's also check where the top slab connection starts.
    // The top slab starts at the vertical line and goes right.
    // Let's check which row connecting to the line starts having drawing pixels on the right.
    let topSlabY = -1;
    for (let y = minY; y <= maxY; y++) {
      // check if pixel at (165, y) is non-transparent
      const alpha = image.getPixelColor(165, y) & 0xff;
      if (alpha > 10) {
        topSlabY = y;
        break;
      }
    }
    
    // Let's check where the bottom slab connection ends.
    let bottomSlabY = -1;
    for (let y = maxY; y >= minY; y--) {
      // check if pixel at (165, y) is non-transparent
      const alpha = image.getPixelColor(165, y) & 0xff;
      if (alpha > 10) {
        bottomSlabY = y;
        break;
      }
    }
    
    console.log(`Top slab connection to vertical line at Y: ${topSlabY}`);
    console.log(`Bottom slab connection to vertical line at Y: ${bottomSlabY}`);
    
    const spaceAtTop = topSlabY - minY;
    const spaceAtBottom = maxY - bottomSlabY;
    console.log(`Space at top (above slab): ${spaceAtTop}px`);
    console.log(`Space at bottom (below slab): ${spaceAtBottom}px`);
  } catch (err) {
    console.error(err);
  }
}

run();
