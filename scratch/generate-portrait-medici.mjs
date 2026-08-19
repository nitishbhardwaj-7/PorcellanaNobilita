import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/Links/MEDICI VILLA copy (7).png';
    const original = await Jimp.read(imgPath);

    // Target mobile portrait dimensions (9:16 aspect ratio)
    const targetW = 1080;
    const targetH = 1920;

    // Scale original image to fit width (1080px)
    // Original: 1920 x 945. Scaled height = 1080 * (945 / 1920) = ~531px.
    const scaledH = Math.round(targetW * (original.height / original.width));
    const scaled = original.resize({ w: targetW, h: scaledH });

    // Create target canvas
    const canvas = new Jimp({ width: targetW, height: targetH, color: 0x000000ff });

    // The scaled building image will be placed at the bottom of the canvas
    const pasteY = targetH - scaledH; // 1920 - 531 = 1389

    // Extrapolate the sky gradient for the top portion (0 to pasteY)
    // We do this by taking the top row of pixels from the scaled image (y = 0)
    // and copying it vertically upwards to fill the top of the canvas.
    for (let x = 0; x < targetW; x++) {
      const topPixelColor = scaled.getPixelColor(x, 0);
      for (let y = 0; y < pasteY; y++) {
        canvas.setPixelColor(topPixelColor, x, y);
      }
    }

    // Paste the scaled image at the bottom
    canvas.composite(scaled, 0, pasteY);

    // Save to the mobile image path
    const outputPath = 'public/images/Links/MEDICI VILLA mobile.png';
    await canvas.write(outputPath);
    console.log(`Successfully generated premium mobile portrait image at ${outputPath}`);
  } catch (err) {
    console.error('Error generating image:', err);
  }
}

run();
