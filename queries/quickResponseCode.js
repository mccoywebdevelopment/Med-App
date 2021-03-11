const QRCode = require('qrcode');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require("fs");

function createCode(url, type, callback) {
    QRCode.toString(url, { type }, function (err, url) {
        if (err) {
            callback(err);
        } else {
            callback(null, url)
        }
    })
}
function render(basePath, data, callback) {
    let templateLocation = basePath + "/template/index.html";
    let handlebarsLocation = basePath + "/handlebars-result/index.html";
    let resultLocation = basePath + "/result/index.pdf";

    fs.readFile(templateLocation, { encoding: 'utf-8' }, function (err, file) {
        if (err) {
            callback(err);
        } else if (!data) {
            callback("Can't find template file.");
        } else {
            var template = Handlebars.compile(file.toString());
            var output = template(data);
            fs.writeFile(handlebarsLocation, output, function (err) {
                if (err) {
                    callback(err);
                } else if (!data) {
                    callback("Can't save template file.");
                } else {
                    callback(null,"test")
                }
              });
            (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto("file://" + handlebarsLocation);
                await page.pdf({ path: resultLocation });

                await browser.close();
            })();
        }
    });
}
function generateFile(basePath, depID, medID, callack) {
    let data = {
        title: "bitch"
    }
    render(basePath, data, function (err, result) {
        if (err) {
            callack(err);
        } else {
            callack(null, result);
        }
    });
}

module.exports = { createCode, generateFile }