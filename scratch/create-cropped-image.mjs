import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11.png';
    const image = await Jimp.read(imgPath);
    
    // Clear everything from x = 930 onwards (set to transparent)
    for (let y = 0; y < image.height; y++) {
      for (let x = 930; x < image.width; x++) {
        image.setPixelColor(0, x, y); // RGBA = 0 (transparent)
      }
    }
    
    const outPath = 'public/images/technical data/11_drawing.png';
    await image.write(outPath);
    console.log('Successfully saved cropped drawing to:', outPath);
  } catch (err) {
    console.error(err);
  }
}

run();
