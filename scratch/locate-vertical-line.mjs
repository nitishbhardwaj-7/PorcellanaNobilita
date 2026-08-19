import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11.png';
    const image = await Jimp.read(imgPath);
    
    // Scan all columns in rows y = 100 to 1400 to find a long vertical line of white pixels.
    // We search for a column that has a high density of non-transparent white pixels.
    let bestX = -1;
    let maxDensity = 0;
    
    for (let x = 0; x < image.width; x++) {
      let density = 0;
      for (let y = 100; y < 1400; y++) {
        const c = image.getPixelColor(x, y);
        const alpha = c & 0xff;
        // Check if pixel is white (RGBA = 0xFFFFFFFF or close to it)
        const r = (c >> 24) & 0xff;
        const g = (c >> 16) & 0xff;
        const b = (c >> 8) & 0xff;
        if (alpha > 100 && r > 200 && g > 200 && b > 200) {
          density++;
        }
      }
      if (density > maxDensity) {
        maxDensity = density;
        bestX = x;
      }
    }
    
    console.log(`Best vertical line column: X = ${bestX} with density ${maxDensity}`);
  } catch (err) {
    console.error(err);
  }
}

run();
