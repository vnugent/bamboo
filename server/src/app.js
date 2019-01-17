"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const puppeteer = require("puppeteer");
const uuid = require("uuid/v1");
var browser;
//var page: puppeteer.Page;
function launch_browser() {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: true });
    });
}
function change_url(url, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        yield page.setViewport({ width: 800, height: 600 });
        yield page.goto(url, { waitUntil: "networkidle0" });
        yield page.waitFor(1500);
        yield page.waitForSelector(".mapboxgl-map");
        yield page.screenshot({
            path: filename,
            fullPage: true,
            type: "jpeg",
            quality: 75
        });
        yield page.close();
    });
}
launch_browser();
// Create a new express application instance
const app = express();
app.get("/", function (req, res, next) {
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
app.listen(8030, function () {
    console.log("Example app listening on port 3000!");
});
