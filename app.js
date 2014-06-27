'use strict';
// define globals
var express  = require('express');
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var request  = require('request');
var fs       = require('fs');
var _        = require('lodash');
var cheerio  = require('cheerio');


var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var url       = "https://drive.google.com/folderview?id=0B5pGhCQSPFB9bjZndkJLNkhnZG8&usp=sharing";

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', function (req, res) {
  request.get(url, function(err, response, body){
    if (err) throw err;

    var $ = cheerio.load(body);
    var result = {};
    result.images = [];
    $('.flip-entry-visual-card img').each(function(i, el){
      result.images.push($(el).attr('src'));
    });

    res.render('index', {images: result.images});
  })
});


server.listen(port, ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), ipaddress, port);
});


