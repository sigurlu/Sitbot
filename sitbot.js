/* global require, process, console */

var url = require('url');
var http = require('http');
var requestify = require('requestify');
var parseString = require('xml2js').parseString;
var hangaren, realfag,json;
var urls = {
  hangaren: 'https://www.sit.no/rss.ap?thisId=36444&lang=0&ma=on&ti=on&on=on&to=on&fr=on',
  realfag: 'https://www.sit.no/rss.ap?thisId=36447&lang=0&ma=on&ti=on&on=on&to=on&fr=on',
  bitcoin: 'https://blockchain.info/address/13iB6CdUKNTunbCtAW4WNvohSs4m41D8uU?format=json'
};

var server = http.createServer(function(req, res) {

  var uri = url.parse(req.url).pathname;
  var today = new Date().getDay();

  var parseStringHandler = function(result) {
    var middager = result['rdf:RDF']
    .item[0]
    .description[0]
    .replace(/(\n *)+/g,'')
    .replace(/\<br\>/g,'\n')
    .replace(/:/g, ": ")
    .split(/<b>.*<\/b>/);

    return middager[today].trim();
  };

  if(uri === '/middag') {
    console.log('Request made for dinner');
    requestify.get(urls.hangaren).then(function(response) {
      var xml = response.body;
      parseString(xml, function (err, result) {
        hangaren = parseStringHandler(result);
      });

      requestify.get(urls.realfag).then(function(response) {
        var xml = response.body;
        parseString(xml, function (err, result) {
          realfag = parseStringHandler(result);
        });
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ "text": "*Hangaren*\n" + hangaren + "\n\n*Realfag*\n" + realfag}));
      });
    });
  } else if(uri === '/bitcoin'){
    console.log('Request made for bitcoin');
    requestify.get(urls.bitcoin).then(function(response) {
      // Get the response body
      json = JSON.parse(response.body);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ "text": "FACEBOOK MONIES: " + json["final_balance"]/100000000 + " BTC"}));
    });
  } 
});

server.listen(process.env.PORT || 5000);
