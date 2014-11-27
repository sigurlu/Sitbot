'use strict';

var url = require('url');
var http = require('http');
var requestify = require('requestify');

var server = http.createServer(function(req, res) {
    
  var uri = url.parse(req.url).pathname;
  var hangaren;
  var realfag;
  var d = new Date();
  var today = d.getDay();
  var parseString = require('xml2js').parseString;
  var bro;
  requestify.get('https://www.sit.no/rss.ap?thisId=36444&lang=0&ma=on&ti=on&on=on&to=on&fr=on').then(function(response) {
    var xml = response.body;
    parseString(xml, function (err, result) {
     hangaren =result['rdf:RDF'].item[0].description[0].replace(/(\n *)+/g,'').replace(/\<br\>/g,'\n').replace(/:/g, ": ");
     var middager = hangaren.split("<b>");
     for(var i = 0; i < middager.length; i++) {
          middager[i] = middager[i].trim().split("</b>")[1];
     }
     hangaren = "*Hangaren*"+middager[today]+"\n";
    // console.log(hangaren)
  });

  requestify.get('https://www.sit.no/rss.ap?thisId=36447&lang=0&ma=on&ti=on&on=on&to=on&fr=on').then(function(response) {
    var xml = response.body;
    parseString(xml, function (err, result) {
     realfag =result['rdf:RDF'].item[0].description[0].replace(/(\n *)+/g,'').replace(/\<br\>/g,'\n').replace(/:/g, ": ");
     bro=realfag;
     console.log(realfag);
     var middager = realfag.split("<b>");
     for(var i = 0; i < middager.length; i++) {
          middager[i] = middager[i].trim().split("</b>")[1];
     }
     realfag = "\n*Realfag*"+middager[today];
     //console.log(realfag);
    });


   var done = hangaren+realfag
  if(uri === '/') {
    res.end(JSON.stringify({ "text": done }));
    console.log('Request made for dinner');
  }
  
  res.writeHead(200, {'Content-Type': 'application/json'});


});

    
});
});
server.listen(process.env.PORT || 5000);