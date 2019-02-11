var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Promise = require('promise');

var PromiseList = [];
var indivPromisesList = [];
var ListeRelaisetChateau = [];
var scraping = 0;

function createPromise() {
    let url = 'https://www.relaischateaux.com/fr/site-map/etablissements'
    PromiseList.push(ListesRC(/*proxyUrl + */url));
}

function ListesRC(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            if (err) {
                console.log(err)
                return reject(err);
            }
            else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                return reject(err);
            }
            var $ = cheerio.load(html);

            let hotelsFrance = $('h3:contains("France")').next();
            hotelsFrance.find('li').length
            hotelsFrance.find('li').each(function () {
                let data = $(this);
                let url = String(data.find('a').attr("href"));
                let name = data.find('a').first().text();
                name = name.replace(/\n/g, "");
                let chefname = String(data.find('a:contains("Chef")').text().split(' - ')[1]);
                chefname = chefname.replace(/\n/g, "");
                hotelsList.push({ "name": name.trim(), "postalCode": "", "chef": chefname.trim(), "url": url, "price": "" })
            })
            resolve(ListeRelaisetChateau);
        });
    });
}

function createIndividualPromises() {
    return new Promise(function (resolve, reject) {
        if (scraping === 0) {
            for (i = 0; i < Math.trunc(ListeRelaisetChateau.length / 2); i++) {
                let hotelURL = ListeRelaisetChateau [i].url;
                indivPromisesList.push(infos(/*proxyUrl + */hotelURL, i));

            }
            resolve();
            scraping++;
        }
        else if (scraping === 1) {
            for (i = ListeRelaisetChateau.length / 2; i < Math.trunc(ListeRelaisetChateau.length); i++) {
                let hotelURL = ListeRelaisetChateau [i].url;
                indivPromisesList.push(infos(/*proxyUrl + */hotelURL, i));

            }
            resolve();
        }
    })
}


function infos(url, index) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                return reject(err);
            }

            const $ = cheerio.load(html);

            $('span[itemprop="postalCode"]').first().each(function () {
                let data = $(this);
                let pc = data.text();
                ListeRelaisetChateau[index].postalCode = String(pc.split(',')[0]).trim();
            })

            $('.price').first().each(function () {
                let data = $(this);
                let price = data.text();
                ListeRelaisetChateau[index].price = String(price);
            })

            resolve(ListeRelaisetChateau);
        });
    });
}

function ToJson() {
    return new Promise(function (resolve, reject) {
        try {
            var jsonHotels = JSON.stringify(ListeRelaisetChateau);
            fs.writeFile("RelaisChateaux.json", jsonHotels, function doneWriting(err) {
                if (err) { console.log(err); }
            });
        }
        catch (error) {
            console.error(error);
        }
        resolve();
    });
}

createPromise();
var prom = promiseList[0];
prom
    .then(createIndividualPromises)
    .then(() => { return Promise.all(indivPromisesList); })
    .then(createIndividualPromises)
    .then(() => { return Promise.all(indivPromisesList); })
    .then(ToJson)


module.exports.getHotelsJSON = function () {
    fs.readFile("relaisetchateau.json", 'utf8', function doneReading(error, data) {
        if (error) { return console.error(error) }
        console.log(JSON.parse(data));
        return JSON.parse(fs.readFileSync("RelaisChateaux.json"));
    });}


