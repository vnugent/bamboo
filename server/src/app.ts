import express = require("express");
import puppeteer = require("puppeteer");
import geocoder = require("./geocoder");
const uuid = require("uuid/v1");

var browser: puppeteer.Browser;
//var page: puppeteer.Page;

async function launch_browser() {
  browser = await puppeteer.launch({ headless: true });
}

async function change_url(url: string, filename: string) {
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitFor(1500);
  await page.waitForSelector(".mapboxgl-map");
  await page.screenshot({
    path: filename,
    fullPage: true,
    type: "jpeg",
    quality: 75
  });
  await page.close();
}

launch_browser();

// Create a new express application instance
const app: express.Application = express();

app.get("/", function(req, res, next) {
  if (req.query) {
    console.log("query: " + req.query.s);
    const filename = uuid() + ".jpg";
    const url = `http://localhost:5000/?query=${req.query.s}`;
    change_url(url, filename)
      .then(() => {
        const options = {
          root: "./",
          dotfiles: "deny",
          headers: {
            "x-timestamp": Date.now(),
            "x-sent": true
          }
        };
        res.download(filename);
        // res.sendFile(filename, options, function(err) {
        //   if (err) {
        //     next(err);
        //   } else {
        //     console.log("Sent:", filename);
        //   }
        // });
        //res.send("hello world");
      })
      .catch(error => {
        next(error);
      });
  }
});

app.listen(8030, function() {
  console.log("Example app listening on port 3000!");
});
