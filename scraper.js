const rp = require("request-promise");
const url = "https://lscluster.hockeytech.com/game_reports/text-game-report.php?lang_id=1&client_code=ahl&game_id=";
const cheerio = require("cheerio");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
var output = [];
const inputName = './data1718.json';
const outputName = './perperiod1718.csv';

fs.readFile(inputName, 'utf8', (err, jsonString) => {
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
  getData(idList);
}

function getData(idList) {
  idList.forEach(function(id){
    rp(url + id)
      .then(function(html){
        const $ = cheerio.load(html);
        const infoString = $('body').html();
        if(!infoString.includes('This game is not available.')){
          cutString(infoString);
        }
      })
      .catch(function(e){
        console.log(e);
      });
  });
}

function cutString(stuff) {
  const start = getPosition(stuff, '<br><br>', 1);
  const end = getPosition(stuff, '<br><br>', 2);
  const dateStart = getPosition(stuff, '<br>', 1);
  const dateEnd = getPosition(stuff, '-', 2);
  const simpleString = stuff.substring(start + 8, end);
  const tempArray = simpleString.split(' ');
  console.log(simpleString);
  var obj = {
    date: stuff.substring(dateStart + 4, dateEnd),
    t1name: '',
    t1p1: '',
    t1p2: '',
    t1p3: '',
    t1p4: '',
    t2name: '',
    t2p1: '',
    t2p2: '',
    t2p3: '',
    t2p4: ''
  };

  if(simpleString.includes("San") || simpleString.includes("Lehigh") || simpleString.includes("Grand")){
    var ind = '';
    if(simpleString.includes("San")){
      ind = "San";
    } else if(simpleString.includes("Lehigh")){
      ind = "Lehigh";
    } else {
      ind = "Grand";
    }
    const where = getPosition(simpleString, ind, 1);
    if(where < 6) {
      if(tempArray[5] == '-'){
        obj.t1name = tempArray[0] + ' ' + tempArray[1];
        obj.t1p1 = tempArray[2];
        obj.t1p2 = tempArray[3];
        obj.t1p3 = tempArray[4];
        obj.t1p4 = null;
        obj.t2name = (tempArray[6]).split('<br>')[1];
        obj.t2p1 = tempArray[7];
        obj.t2p2 = tempArray[8];
        obj.t2p3 = tempArray[9];
        if(tempArray[10] == '-'){
          obj.t2p4 = null;
        } else {
          obj.t2p4 = tempArray[10];
        }
      } else {
        obj.t1name = tempArray[0] + ' ' + tempArray[1];
        obj.t1p1 = tempArray[2];
        obj.t1p2 = tempArray[3];
        obj.t1p3 = tempArray[4];
        obj.t1p4 = tempArray[5];
        obj.t2name = (tempArray[7]).split('<br>')[1];
        obj.t2p1 = tempArray[8];
        obj.t2p2 = tempArray[9];
        obj.t2p3 = tempArray[10];
        if(tempArray[11] == '-'){
          obj.t2p4 = null;
        } else {
          obj.t2p4 = tempArray[11];
        }
      }
    } else { // its in the second half, aka its the second team
      if(tempArray[4] == '-'){
        obj.t1name = tempArray[0];
        obj.t1p1 = tempArray[1];
        obj.t1p2 = tempArray[2];
        obj.t1p3 = tempArray[3];
        obj.t1p4 = null;
        obj.t2name = (tempArray[5]).split('<br>')[1] + ' ' + tempArray[6];
        obj.t2p1 = tempArray[7];
        obj.t2p2 = tempArray[8];
        obj.t2p3 = tempArray[9];
        if(tempArray[10] == '-'){
          obj.t2p4 = null;
        } else {
          obj.t2p4 = tempArray[10];
        }
      } else {
        obj.t1name = tempArray[0];
        obj.t1p1 = tempArray[1];
        obj.t1p2 = tempArray[2];
        obj.t1p3 = tempArray[3];
        obj.t1p4 = tempArray[4];
        obj.t2name = (tempArray[6]).split('<br>')[1] + tempArray[7];
        obj.t2p1 = tempArray[8];
        obj.t2p2 = tempArray[9];
        obj.t2p3 = tempArray[10];
        if(tempArray[11] == '-'){
          obj.t2p4 = null;
        } else {
          obj.t2p4 = tempArray[11];
        }
      }
    }
    output.push(obj);
  } else {
    if(tempArray[4] == '-'){
      obj.t1name = tempArray[0];
      obj.t1p1 = tempArray[1];
      obj.t1p2 = tempArray[2];
      obj.t1p3 = tempArray[3];
      obj.t1p4 = null;
      obj.t2name = (tempArray[5]).split('<br>')[1];
      obj.t2p1 = tempArray[6];
      obj.t2p2 = tempArray[7];
      obj.t2p3 = tempArray[8];
      if(tempArray[9] == '-'){
        obj.t2p4 = null;
      } else {
        obj.t2p4 = tempArray[9];
      }
    } else {
      obj.t1name = tempArray[0];
      obj.t1p1 = tempArray[1];
      obj.t1p2 = tempArray[2];
      obj.t1p3 = tempArray[3];
      obj.t1p4 = tempArray[4];
      obj.t2name = (tempArray[6]).split('<br>')[1];
      obj.t2p1 = tempArray[7];
      obj.t2p2 = tempArray[8];
      obj.t2p3 = tempArray[9];
      if(tempArray[10] == '-'){
        obj.t2p4 = null;
      } else {
        obj.t2p4 = tempArray[10];
      }
    }
    output.push(obj);
  }

  exportData(output);
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function exportData(array) {
  (async () => {
    const csv = new ObjectsToCsv(array);
    await csv.toDisk(outputName, {allColumns: true});
  })();
}
