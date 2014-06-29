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


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/models', function (req, res) {
  res.render('models');
});

app.get('/models/:id', function (req, res) {
  res.render('models');
});


server.listen(port, ipaddress, function() {
  console.log('%s: Node server started on %s:%d ...',
    Date(Date.now() ), ipaddress, port);
});


