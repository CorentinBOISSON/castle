const Promise = require('promise');
const relaisetchateau = require('./relaisetchateau.js');
const michelin = require('./michelin.js');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


'use strict';

const hotelsJSON = relaisetchateau.getHotelsJSON();
const michelinJSON = michelin.getRestaurantsJSON();

fs.writeFileSync("RelaisetChateauEtoiles.json",JSON.stringify(findMutualChefsAndPCs(hotelsJSON, michelinJSON)));

function findMutualChefsAndPCs(hotelsList, michelinsList) {
    var starredHotels = [];
    for (var i = 0; i < hotelsList.length; i++) {
        for (var j = 0; j < michelinsList.length; j++) {
            if (hotelsList[i].chef === michelinsList[j].chef && hotelsList[i].postalCode === michelinsList[j].postalCode) {
                starredHotels.push({"hotelName": hotelsList[i].name, "restaurantName": michelinsList[j].name, "postalCode": hotelsList[i].postalCode, "chef": hotelsList[i].chef, "url": hotelsList[i].url, "price": hotelsList[i].price })
            }
        }
    }
    return starredHotels;
}

function readJSON(path) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
        if (this.status === 200) {
            let file = new File([this.response], 'temp');
            let fileReader = new FileReader();
            fileReader.addEventListener('load', function(){
                console.log(fileReader.result[0].price);
                for (let i = 0; i < 10; i++){
                    console.log("Hotel " + i + ": ");
                    console.log(fileReader.result[i].hotelName);
                    console.log("Prix:");
                    console.log(fileReader.result[i].price);
                }
            });
            fileReader.readAsText(file);
        }
    };
    xhr.send();
}

readJSON("RelaisetChateauEtoiles.json");


/* global PRIVATEASER*/
'use strict';

(() => {
    const render = (actors) => {
        const fragment = document.createDocumentFragment();
        const div = document.createElement('div');
        const template = actors.map(actor => {
            return `
        <div class="actor">
          <span>${actor.who}</span>
          <span>${actor.type}</span>
          <span>${actor.amount}</span>
        </div>
      `;
        }).join('');

        div.innerHTML = template;
        fragment.appendChild(div);
        document.querySelector('#actors').innerHTML = '';
        document.querySelector('#actors').appendChild(fragment);
    };

    const button = document.querySelector('#compute');

    button.addEventListener('click', function onClick () {
        const bar = PRIVATEASER.getBar();
        const time = document.querySelector('.js-time').value;
        const persons = document.querySelector('.js-persons').value;
        const option = document.querySelector('.js-option').checked;
        const actors = PRIVATEASER.payActors(bar, time, persons, option);

        render(actors);

        return;
    });
})();
