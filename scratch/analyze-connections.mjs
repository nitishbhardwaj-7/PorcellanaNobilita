import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/technical data/11_drawing.png';
    const image = await Jimp.read(imgPath);
    
    // The vertical line is at x=161.
    // Let's find columns x > 161 where there are pixels connected to the line.
    // We want to find the first y coordinate (greater than minY) where there's a pixel at x=163, x=165, etc.
    let minY = 57;
    let maxY = 1485;
    
    console.log("Analyzing connections from y = 57 to 1485...");
    for (let y = minY; y <= maxY; y++) {
      // check how many pixels are non-transparent in x = 162 to 170
      let connectedCount = 0;
      for (let x = 162; x <= 170; x++) {
        if ((image.getPixelColor(x, y) & 0xff) > 10) {
          connectedCount++;
        }
      }
      if (connectedCount > 0) {
        console.log(`Row Y=${y} has ${connectedCount} connected pixels in cols 162-170`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

run();
