import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11.png';
    const image = await Jimp.read(imgPath);
    
    // We want to find the non-transparent pixels' y coordinates for x > 970.
    const rowDensity = new Array(image.height).fill(0);
    
    for (let y = 0; y < image.height; y++) {
      for (let x = 970; x < image.width; x++) {
        const color = image.getPixelColor(x, y);
        const alpha = color & 0xff;
        if (alpha > 10) { // not fully transparent
          rowDensity[y]++;
        }
      }
    }
    
    // Group active rows (where density > 0)
    let textBlocks = [];
    let inBlock = false;
    let blockStart = 0;
    
    for (let y = 0; y < image.height; y++) {
      if (rowDensity[y] > 0) {
        if (!inBlock) {
          blockStart = y;
          inBlock = true;
        }
      } else {
        if (inBlock) {
          textBlocks.push([blockStart, y - 1]);
          inBlock = false;
        }
      }
    }
    if (inBlock) {
      textBlocks.push([blockStart, image.height - 1]);
    }
    
    console.log('Text blocks vertical ranges (Y):', textBlocks);
  } catch (err) {
    console.error(err);
  }
}

run();
