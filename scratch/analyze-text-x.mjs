import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11.png';
    const image = await Jimp.read(imgPath);
    
    // Scan block 1: Y 500 to 600
    let minX1 = image.width, maxX1 = 0;
    for (let y = 500; y <= 600; y++) {
      for (let x = 970; x < image.width; x++) {
        const alpha = image.getPixelColor(x, y) & 0xff;
        if (alpha > 10) {
          if (x < minX1) minX1 = x;
          if (x > maxX1) maxX1 = x;
        }
      }
    }
    
    // Scan block 2: Y 1040 to 1140
    let minX2 = image.width, maxX2 = 0;
    for (let y = 1040; y <= 1140; y++) {
      for (let x = 970; x < image.width; x++) {
        const alpha = image.getPixelColor(x, y) & 0xff;
        if (alpha > 10) {
          if (x < minX2) minX2 = x;
          if (x > maxX2) maxX2 = x;
        }
      }
    }
    
    console.log(`Block 1 (Upper) X range: from ${minX1} to ${maxX1}`);
    console.log(`Block 2 (Lower) X range: from ${minX2} to ${maxX2}`);
  } catch (err) {
    console.error(err);
  }
}

run();
