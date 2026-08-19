import { Jimp } from 'jimp';

async function cropImage() {
  try {
    const imgPath = 'public/images/technical data/11_drawing.png';
    const image = await Jimp.read(imgPath);
    
    console.log(`Original dimensions: ${image.width}x${image.height}`);
    
    let minY = image.height;
    let maxY = 0;
    let minX = image.width;
    let maxX = 0;
    
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const color = image.getPixelColor(x, y);
        // alpha component in Jimp rgba integer format: (color & 0x000000ff)
        const alpha = color & 0xff;
        if (alpha > 5) { // non-transparent pixel
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    
    console.log(`Content bounding box: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
    console.log(`Top invisible gap: ${minY}px, Bottom invisible gap: ${image.height - 1 - maxY}px`);
    
    if (minY <= maxY && minX <= maxX) {
      // Add small margin (e.g. 5px or 10px padding) if desired, or tight crop
      // Let's crop tight to non-transparent bounding box
      const cropX = minX;
      const cropY = minY;
      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;
      
      console.log(`Cropping to: x=${cropX}, y=${cropY}, w=${cropW}, h=${cropH}`);
      
      image.crop({ x: cropX, y: cropY, w: cropW, h: cropH });
      
      await image.write(imgPath);
      console.log(`Successfully cropped image. New dimensions: ${image.width}x${image.height}`);
    } else {
      console.log('No content pixels found to crop!');
    }
  } catch (err) {
    console.error(err);
  }
}

cropImage();
