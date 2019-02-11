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