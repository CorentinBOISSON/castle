var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Promise = require('promise');
var PromiseList = [];
var indivPromisesList = [];
var ListeMichelin = [];
var scraping = 0;

function createPromises() {
    for (i = 1; i <= 37; i++) {
        let url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-' + i.toString();
        PromiseList.push(ListeM(/*proxyUrl + */url));
    }
}


function ListeM(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            if (err) {
                console.error(err)
                return reject(err);
            }
            else if (res.statusCode !== 200) { //200 means request succesfull
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                console.error(err)
                return reject(err);
            }
            var $ = cheerio.load(html);
            $('.poi-card-link').each(function () {
                let data = $(this);
                let link = data.attr("href");
                let url = "https://restaurant.michelin.fr/" + link;
                ListeMichelin.push({ "name": "", "postalCode": "", "chef": "", "url": url })
            })
            resolve(ListeMichelin);
        });
    });
}


function createIndividualPromises() {
    return new Promise(function (resolve, reject) {
        if (scraping === 0) {
            for (i = 0; i < ListeMichelin.length / 2; i++) {
                let restaurantURL = ListeMichelin[i].url;
                indivPromisesList.push(Infos(/*proxyUrl + */restaurantURL, i));

            }
            resolve();
            scraping++;
        }
        if (scraping === 1) {
            for (i = ListeMichelin.length / 2; i < ListeMichelin.length; i++) {
                let restaurantURL = ListeMichelin[i].url;
                indivPromisesList.push(Infos(/*proxyUrl + */restaurantURL, i));

            }
            resolve();
        }
    })
}


function Infos(url, index) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                console.error(err)
                return reject(err);
            }

            const $ = cheerio.load(html);
            $('.poi_intro-display-title').first().each(function () {
                let data = $(this);
                let name = data.text();
                name = name.replace(/\n/g, ""); //We need to take out all the newlines because this would cause some problems for the json
                ListeMichelin[index].name = name.trim();
            })

            $('.postal-code').first().each(function () {
                let data = $(this);
                let pc = data.text();
                ListeMichelin[index].postalCode = pc;
            })

            $('#node_poi-menu-wrapper > div.node_poi-chef > div.node_poi_description > div.field.field--name-field-chef.field--type-text.field--label-above > div.field__items > div').first().each(function () {
                let data = $(this);
                let chefname = data.text();
                ListeMichelin[index].chef = chefname;
            })
            resolve(ListeMichelin);
        });
    });
}

function ToJson() {
    return new Promise(function (resolve, reject) {
        try {
            var jsonRestaurants = JSON.stringify(ListeMichelin);
            fs.writeFile("RestaurantsMichelin.json", jsonRestaurants, function doneWriting(err) {
                if (err) { console.error(err); }
            });
        }
        catch (error) {
            console.error(error);
        }
        resolve();
    });
}


createPromises();
Promise.all(PromiseList)
    .then(createIndividualPromises)
    .then(() => { return Promise.all(indivPromisesList); })
    .then(createIndividualPromises)
    .then(() => { return Promise.all(indivPromisesList); })
    .then(ToJson)



module.exports.getRestaurantsJSON = function () {
    return JSON.parse(fs.readFileSync("RestaurantsMichelin.json"));
};



