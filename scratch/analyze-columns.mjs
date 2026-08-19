import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11.png';
    const image = await Jimp.read(imgPath);
    
    // We want to find the non-transparent pixels' x coordinates.
    // Let's print out the min and max x coordinate for non-transparent pixels.
    let minX = image.width;
    let maxX = 0;
    
    // We can also analyze the density of non-transparent pixels per column
    const columnDensity = new Array(image.width).fill(0);
    
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const color = image.getPixelColor(x, y);
        const alpha = color & 0xff;
        if (alpha > 10) { // not fully transparent
          columnDensity[x]++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    
    console.log(`Non-transparent bounding box: X from ${minX} to ${maxX}`);
    
    // Find gaps in columns where density is 0, which could separate drawing from text
    let gaps = [];
    let inGap = false;
    let gapStart = 0;
    for (let x = minX; x <= maxX; x++) {
      if (columnDensity[x] === 0) {
        if (!inGap) {
          gapStart = x;
          inGap = true;
        }
      } else {
        if (inGap) {
          gaps.push([gapStart, x - 1]);
          inGap = false;
        }
      }
    }
    if (inGap) {
      gaps.push([gapStart, maxX]);
    }
    
    console.log('Gaps in column density:', gaps);
  } catch (err) {
    console.error(err);
  }
}

run();
