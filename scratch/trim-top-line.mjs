import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11_drawing.png';
    const image = await Jimp.read(imgPath);
    
    // Clear the vertical line at the top:
    // We want the vertical line to start at Y = 229 (which gives a 95px spacing above Y = 324).
    // Let's set all pixels in the region x: [0, 200], y: [0, 228] to transparent (0).
    for (let y = 0; y < 229; y++) {
      for (let x = 0; x < 200; x++) {
        image.setPixelColor(0, x, y);
      }
    }
    
    await image.write(imgPath);
    console.log('Successfully trimmed the top of the vertical line in 11_drawing.png');
  } catch (err) {
    console.error(err);
  }
}

run();
