var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

router.get('/render/:slug', function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();
    page.on('request', req => {
      let headers = req.headers;
      headers['referer'] = 'https://www.facebook.com/';
      req.continue({
        headers: headers
      });
    });
    await page.setExtraHTTPHeaders({
      'referer': 'https://www.facebook.com/'
    });
    await page.goto(req.params.slug)
    let content = await page.content();
    await browser.close();
    await res.send(content);
  })();
});

module.exports = router;
