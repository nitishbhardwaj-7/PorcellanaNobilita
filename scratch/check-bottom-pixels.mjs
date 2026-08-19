import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/Links/medici-villa-mobile.png';
    const image = await Jimp.read(imgPath);
    
    // Check pixel colors at the bottom row (Y = 1919)
    console.log('Image dimensions:', image.width, 'x', image.height);
    console.log('Bottom pixels at Y = 1919:');
    for (let x = 0; x < image.width; x += 100) {
      const color = image.getPixelColor(x, 1919);
      const r = (color >> 24) & 0xff;
      const g = (color >> 16) & 0xff;
      const b = (color >> 8) & 0xff;
      const a = color & 0xff;
      console.log(`X = ${x}: rgba(${r}, ${g}, ${b}, ${a})`);
    }
  } catch (err) {
    console.error(err);
  }
}

run();
