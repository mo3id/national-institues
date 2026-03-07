const https = require('https');
const fs = require('fs');

console.log("Starting download...");
https.get('https://gani.edu.eg/api.php?action=get_site_data', { timeout: 10000 }, (res) => {
  let rawData = '';
  res.on('data', (chunk) => {
    rawData += chunk;
    if (rawData.trim().endsWith('}')) {
      try {
        JSON.parse(rawData);
        fs.writeFileSync('public/site_data.json', rawData);
        console.log("JSON successfully written");
        process.exit(0);
      } catch (e) {
        // wait for more data
      }
    }
  });
  res.on('end', () => {
    console.log("Stream ended naturally");
  });
}).on('error', (e) => {
  console.error("Error:", e);
});
