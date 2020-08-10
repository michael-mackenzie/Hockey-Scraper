const rp = require("request-promise");
const url = "https://theahl.com/stats/game-summary/";
const cheerio = require("cheerio");
const fs = require('fs');

fs.readFile('./data1920.json', 'utf8', (err, jsonString) => {
  if(err){
    console.log(err);
    return;
  }
  try{
    const data = JSON.parse(jsonString);
    processFile(data.SiteKit.Schedule);
  } catch(err){
    console.log(err);
  }
});

function processFile(content) {
  var idList = [];
  content.forEach((item, index) => {
    idList.push(item.game_id);
  });
  console.log(idList);
  getData(idList);
}

function getData(idList) {
  idList.forEach(function(id){
    rp(url + id)
      .then(function(html){
        const $ = cheerio.load(html);
        const infoString = $('tr > td').text();
        console.log(infoString);
      })
      .catch(function(e){
        console.log(e);
      });
  });
}
