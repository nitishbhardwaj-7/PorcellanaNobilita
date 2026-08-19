import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/Links/MEDICI VILLA copy (7).png';
    const original = await Jimp.read(imgPath);

    // Target mobile portrait dimensions (9:16 aspect ratio)
    const targetW = 1080;
    const targetH = 1920;

    // We want the building to be centered with margins on the left and right.
    // Let's set the building width on the mobile screen to 920px (leaving 80px margins on each side).
    const buildingW = 920;
    const buildingH = Math.round(buildingW * (original.height / original.width)); // ~453px

    // Resize the original building image
    const scaled = original.resize({ w: buildingW, h: buildingH });

    // Create target canvas
    const canvas = new Jimp({ width: targetW, height: targetH, color: 0x000000ff });

    // Paste coordinates
    const pasteX = Math.round((targetW - buildingW) / 2); // 80
    const pasteY = targetH - buildingH; // 1920 - 453 = 1467

    // Paste the scaled image onto the canvas at the centered bottom position
    canvas.composite(scaled, pasteX, pasteY);

    // Now, extend the left margin (X: 0 to pasteX-1) by copying the colors from X = pasteX
    for (let y = pasteY; y < targetH; y++) {
      const edgeColor = canvas.getPixelColor(pasteX, y);
      for (let x = 0; x < pasteX; x++) {
        canvas.setPixelColor(edgeColor, x, y);
      }
    }

    // Extend the right margin (X: pasteX + buildingW to targetW-1) by copying colors from X = pasteX + buildingW - 1
    const rightEdgeX = pasteX + buildingW - 1;
    for (let y = pasteY; y < targetH; y++) {
      const edgeColor = canvas.getPixelColor(rightEdgeX, y);
      for (let x = rightEdgeX + 1; x < targetW; x++) {
        canvas.setPixelColor(edgeColor, x, y);
      }
    }

    // Extend the top sky gradient vertically (Y: 0 to pasteY-1) by copying the color at Y = pasteY for the same X
    for (let x = 0; x < targetW; x++) {
      const topEdgeColor = canvas.getPixelColor(x, pasteY);
      for (let y = 0; y < pasteY; y++) {
        canvas.setPixelColor(topEdgeColor, x, y);
      }
    }

    // Save to the mobile image path
    const outputPath = 'public/images/Links/medici-villa-mobile.png';
    await canvas.write(outputPath);
    console.log(`Successfully generated centered mobile portrait image at ${outputPath}`);
  } catch (err) {
    console.error('Error generating image:', err);
  }
}

run();
