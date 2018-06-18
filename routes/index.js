var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

router.get('/render/:slug', function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true).catch(function(err) {browser.close(); res.send("500");});
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
    await page.goto(req.params.slug, {"waitUntil" : "networkidle2", "timeout" : 10000}).catch(function(err) {})
    var result={};
    result['tree'] = await page._client.send('Page.getResourceTree');
    result['html'] = await page.content().catch(function(err) {browser.close(); res.send("500");});
    await browser.close().catch(function(err) {browser.close(); res.send("500");});
    await res.send(result);
  })();
});

module.exports = router;
