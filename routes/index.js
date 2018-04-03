var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
var request = require('request');
const cheerio = require('cheerio');



/* GET home page. */
router.get('/', function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://facebook.com')
    await page.type('input#email', 'rlewkowiczge@gmail.com')
    await page.type('input#pass', 'H4ck3r123!')
    page.click('#loginbutton input'); // no await here
    await page.waitForNavigation();
    var cook = await page.cookies();
    await request.put('http://127.0.0.1:8500/v1/kv/test', {
      form: JSON.stringify(cook)
    })
    await page.goto('https://rssparse.test/login')
    await page.click('a');
    await browser.close();
    await page.goto('https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.wsj.com%2Farticles%2Fu-s-expels-60-russian-officials-over-poisoning-of-ex-spy-in-u-k-1522071201%3Fmod%3Dfox_australian&h=ATMF7EIES5LpMMQ-B4IcVwiAvGZHvNe974TSi9VoXmxIcCJoxWwUupLbH9QZxKRFd5rlhEq9zZcr2Oe2K_RvTaZAO7YOtOIFd7pX_eTNcbVsZcg6V26zUNF5rya7_Q')
    await request.put('http://127.0.0.1:8500/v1/kv/html', {
      form: await page.content()
    })
    res.render('index', {
      title: 'Express'
    });
  })();
});
router.get('/page/:slug', function(req, res, next) {
  request('http://127.0.0.1:8500/v1/kv/test', function(error, response, body) {
    (async () => {
      let buff = new Buffer(JSON.parse(body)[0]["Value"], 'base64');
      let cook = JSON.parse(buff.toString('ascii'));
      const browser = await puppeteer.launch({
        headless: false
      });
      const page = await browser.newPage();
      await page.setCookie(cook[0], cook[1], cook[2], cook[3], cook[4], cook[5], cook[6]);
      console.log(req.params.slug);
      await page.goto(req.params.slug);
      let $ = cheerio.load(await page.content())
      await page.goto($('.userContent').find('a').attr('href'));
      res.send(await page.content());
      await browser.close();
    })();
  });
  router.get('/noproxy/:slug', function(req, res, next) {
    request('http://127.0.0.1:8500/v1/kv/test', function(error, response, body) {
      (async () => {
        let buff = new Buffer(JSON.parse(body)[0]["Value"], 'base64');
        let html = JSON.parse(buff.toString('ascii'));
        res.send(html);
      })();
    });
  });
});
module.exports = router;
