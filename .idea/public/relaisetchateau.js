var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Promise = require('promise');

var PromiseList = [];
var indivPromisesList = [];
var ListeRelaisetChateau = [];
var scraping = 0;