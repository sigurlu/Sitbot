/* global require, process, console */

var url = require('url');
var http = require('http');
var requestify = require('requestify');
var parseString = require('xml2js').parseString;
var hangaren, realfag;

var urls = {
  hangaren: 'https://www.sit.no/rss.ap?thisId=36444&lang=0&ma=on&ti=on&on=on&to=on&fr=on',
  realfag: 'https://www.sit.no/rss.ap?thisId=36447&lang=0&ma=on&ti=on&on=on&to=on&fr=on'
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

      if(uri === '/') {
        res.end(JSON.stringify({ "text": "*Hangaren*\n" + hangaren + "\n\n*Realfag*\n" + realfag}));
        console.log('Request made for dinner');
      }

      res.writeHead(200, {'Content-Type': 'application/json'});
    });
  });
});

server.listen(process.env.PORT || 5000);
