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
    promiseList.push(fillHotelsList(/*proxyUrl + */url));
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