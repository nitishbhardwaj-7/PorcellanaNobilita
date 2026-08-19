import { Jimp } from 'jimp';

async function run() {
  try {
    const imgPath = 'public/images/Links/MEDICI VILLA copy (7).png';
    const image = await Jimp.read(imgPath);
    
    // We want to find the horizontal center axis X of symmetry.
    // The building is between Y = 300 and Y = 900.
    // We will test potential center X values from 900 to 1020 (near the image center of 960).
    // For each candidate X, we calculate the absolute difference between pixel colors
    // at X - d and X + d for a range of d (e.g. 50 to 700 pixels).
    
    let bestX = 960;
    let minDiff = Infinity;
    
    console.log('Analyzing symmetry to find the building center...');
    
    for (let candidateX = 920; candidateX <= 1000; candidateX++) {
      let totalDiff = 0;
      let count = 0;
      
      // Sample rows from Y = 350 to Y = 850 (stepping by 10 for speed)
      for (let y = 350; y < 850; y += 10) {
        // Compare pixels at distance d from candidateX
        for (let d = 10; d < 600; d += 5) {
          const leftX = candidateX - d;
          const rightX = candidateX + d;
          
          if (leftX >= 0 && rightX < image.width) {
            const colorL = image.getPixelColor(leftX, y);
            const colorR = image.getPixelColor(rightX, y);
            
            const rL = (colorL >> 24) & 0xff;
            const gL = (colorL >> 16) & 0xff;
            const bL = (colorL >> 8) & 0xff;
            
            const rR = (colorR >> 24) & 0xff;
            const gR = (colorR >> 16) & 0xff;
            const bR = (colorR >> 8) & 0xff;
            
            // Sum of absolute differences
            const diff = Math.abs(rL - rR) + Math.abs(gL - gR) + Math.abs(bL - bR);
            totalDiff += diff;
            count++;
          }
        }
      }
      
      const avgDiff = totalDiff / count;
      console.log(`Candidate Center X = ${candidateX}: Avg Diff = ${avgDiff.toFixed(2)}`);
      
      if (avgDiff < minDiff) {
        minDiff = avgDiff;
        bestX = candidateX;
      }
    }
    
    console.log(`\nExact building center of symmetry found at X = ${bestX}`);
    console.log(`Original image center is X = ${image.width / 2} (960)`);
    console.log(`Difference: ${bestX - 960}px`);
  } catch (err) {
    console.error(err);
  }
}

run();
