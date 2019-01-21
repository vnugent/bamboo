import express from "express";
import puppeteer from "puppeteer-core";
const uuid = require("uuid/v1");

const _mapViewEndpoint = process.env.MAPVIEW_WS
  ? process.env.MAPVIEW_WS
  : "http://localhost:5000";
console.log("Webview WS: ", _mapViewEndpoint);

const _browserWSEndpoint = process.env.BROWSER_WS
  ? process.env.BROWSER_WS
  : "ws://localhost:3000";
console.log("Browser WS: ", _browserWSEndpoint);

//var browser: puppeteer.Browser;
//var page: puppeteer.Page;

async function launch_browser() {}

async function change_url(url: string, filename: string) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: _browserWSEndpoint
  });

  const page = await browser.newPage();
  try {
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
    browser.close();
  } catch (error) {
    console.log({ error }, "Browser error");
    browser.close();
    Promise.reject(new Error("Browser error exception"));
  }
}

launch_browser();

// Create a new express application instance
const app: express.Application = express();

app.get("/", function(req, res, next) {
  if (req.query) {
    const query = encodeURIComponent(req.query.s);
    console.log("downloadable ", req.query.d);
    const downloadable = req.query.d ? true : false;
    const filename = "./" + uuid() + ".jpg";
    const url = `${_mapViewEndpoint}/?query=${query}`;
    console.log("sending url ", url, downloadable);
    change_url(url, filename)
      .then(() => {
        if (downloadable) {
          res.download(filename);
        } else {
          const options = {
            root: "./",
            dotfiles: "deny",
            headers: {
              "x-timestamp": Date.now(),
              "x-sent": true
            }
          };
          res.sendFile(filename, options);
        }
      })
      .catch(error => {
        console.log("error ", error);
        next(error);
      });
  }
});

app.listen(8030, function() {
  console.log("Example app listening on port 8030!");
});
