const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    const info = await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    const inputSize = fs.statSync(inputPath).size;
    const outputSize = info.size;
    const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(2);
    
    console.log(`✅ ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    console.log(`   Original: ${(inputSize / 1024).toFixed(2)} KB`);
    console.log(`   WebP: ${(outputSize / 1024).toFixed(2)} KB`);
    console.log(`   Savings: ${savings}%\n`);
    
    return { inputSize, outputSize, savings };
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  const publicDir = path.join(__dirname, 'public');
  
  const imagesToConvert = [
    { input: 'our-schools.png', output: 'our-schools.webp', quality: 80 },
    { input: 'news_list_hero.png', output: 'news_list_hero.webp', quality: 80 },
    { input: 'chairman.png', output: 'chairman.webp', quality: 85 },
    { input: 'image.png', output: 'image.webp', quality: 80 },
  ];
  
  console.log('🚀 Starting image conversion to WebP...\n');
  
  let totalInputSize = 0;
  let totalOutputSize = 0;
  
  for (const img of imagesToConvert) {
    const inputPath = path.join(publicDir, img.input);
    const outputPath = path.join(publicDir, img.output);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${img.input} (not found)\n`);
      continue;
    }
    
    const result = await convertToWebP(inputPath, outputPath, img.quality);
    if (result) {
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
    }
  }
  
  const totalSavings = ((totalInputSize - totalOutputSize) / totalInputSize * 100).toFixed(2);
  
  console.log('📊 TOTAL RESULTS:');
  console.log(`   Total Original: ${(totalInputSize / 1024).toFixed(2)} KB`);
  console.log(`   Total WebP: ${(totalOutputSize / 1024).toFixed(2)} KB`);
  console.log(`   Total Savings: ${totalSavings}%`);
  console.log(`   Saved: ${((totalInputSize - totalOutputSize) / 1024).toFixed(2)} KB\n`);
  
  console.log('✅ Conversion complete!');
}

main();
