var request = require('request');
var cheerio = require('cheerio');

request('https://www.relaischateaux.com/fr/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        console.log(html);
    }
});

