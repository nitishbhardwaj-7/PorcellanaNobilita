import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11.png';
    const image = await Jimp.read(imgPath);
    console.log('Dimensions:', image.width, 'x', image.height);
    
    // Check pixel at 0, 0
    const color = image.getPixelColor(0, 0);
    // getPixelColor returns a numeric value, let's format it to RGBA hex
    // In jimp v1, color is a number. Let's print it and inspect RGBA components.
    const r = (color >> 24) & 0xff;
    const g = (color >> 16) & 0xff;
    const b = (color >> 8) & 0xff;
    const a = color & 0xff;
    console.log(`Pixel at (0,0): R=${r}, G=${g}, B=${b}, A=${a}`);
    
    // Let's check some other pixel to see if it is transparent
    let transparentCount = 0;
    let blackCount = 0;
    for (let y = 0; y < image.height; y += 10) {
      for (let x = 0; x < image.width; x += 10) {
        const c = image.getPixelColor(x, y);
        const alpha = c & 0xff;
        if (alpha === 0) {
          transparentCount++;
        } else {
          // check if it's solid black (excluding alpha)
          const red = (c >> 24) & 0xff;
          const green = (c >> 16) & 0xff;
          const blue = (c >> 8) & 0xff;
          if (red === 0 && green === 0 && blue === 0 && alpha === 255) {
            blackCount++;
          }
        }
      }
    }
    console.log(`Sampled pixels: transparent=${transparentCount}, solid black=${blackCount}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
