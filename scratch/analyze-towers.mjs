import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/Links/MEDICI VILLA copy (7).png';
    const image = await Jimp.read(imgPath);
    
    // We will scan across the image horizontally at Y = 400 (where the towers are)
    // to detect where the sky ends and the building towers start/end.
    // Let's sample pixel colors at Y = 400.
    const y = 400;
    
    // Let's print out some pixels to understand the background sky color
    // Sky is blue, so it should have a high Blue component and lower Red/Green.
    // The tower is white/gray, so Red, Green, Blue should be relatively equal (grayscale).
    console.log('Scanning Y = 400:');
    let firstNonSkyX = -1;
    let lastNonSkyX = -1;
    
    for (let x = 0; x < image.width; x++) {
      const color = image.getPixelColor(x, y);
      const r = (color >> 24) & 0xff;
      const g = (color >> 16) & 0xff;
      const b = (color >> 8) & 0xff;
      
      // Sky blue has higher blue, e.g., R ~ 110, G ~ 140, B ~ 180
      // Tower has stone color, e.g., R ~ 180, G ~ 175, B ~ 170
      // A simple heuristic: if R > 150 or if Blue is not significantly larger than Red (e.g. B - R < 35), it's probably the tower.
      const isSky = (b - r > 30) && (b - g > 15) && (r < 150);
      
      if (!isSky) {
        if (firstNonSkyX === -1) firstNonSkyX = x;
        lastNonSkyX = x;
      }
    }
    
    console.log(`Building detected from X = ${firstNonSkyX} to X = ${lastNonSkyX}`);
    console.log(`Building width: ${lastNonSkyX - firstNonSkyX}px`);
    console.log(`Image center: ${image.width / 2}`);
    console.log(`Building center: ${(firstNonSkyX + lastNonSkyX) / 2}`);
    console.log(`Left margin to tower: ${firstNonSkyX}px`);
    console.log(`Right margin to tower: ${image.width - lastNonSkyX}px`);
  } catch (err) {
    console.error(err);
  }
}

run();
