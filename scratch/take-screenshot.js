const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewport({ width: 1280, height: 800 });

  // Navigate to local server
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Wait a little extra just in case
  await new Promise(r => setTimeout(r, 2000));

  // Take a screenshot
  await page.screenshot({ path: 'scratch/screenshot-light.png', fullPage: true });

  await browser.close();
  console.log('Screenshot saved to scratch/screenshot-light.png');
})();
