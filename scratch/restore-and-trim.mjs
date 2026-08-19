import { Jimp } from 'jimp';

async function run() {
  try {
    // Load the original image
    const originalPath = 'public/images/technical data/11.png';
    const image = await Jimp.read(originalPath);
    
    // 1. Clear the text on the right (columns x >= 930)
    for (let y = 0; y < image.height; y++) {
      for (let x = 930; x < image.width; x++) {
        image.setPixelColor(0, x, y);
      }
    }
    
    // 2. Clear the top vertical line from Y = 0 to Y = 204 (so it starts at Y = 205)
    // This gives exactly 120px of spacing above the top slab connection at Y = 325,
    // matching the bottom spacing of 120px exactly.
    for (let y = 0; y < 205; y++) {
      for (let x = 0; x < 200; x++) {
        image.setPixelColor(0, x, y);
      }
    }
    
    const outputPath = 'public/images/technical data/11_drawing.png';
    await image.write(outputPath);
    console.log('Successfully recreated and trimmed 11_drawing.png with perfect symmetrical spacing.');
  } catch (err) {
    console.error(err);
  }
}

run();
