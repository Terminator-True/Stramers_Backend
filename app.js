'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var _routes = require("./src/routes")
const path = require("path")
var fs = require('fs');
const cors = require("cors");

var app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());


//CORS
app.use(cors())

//Rutes
app.use("/api",_routes)

app.get('/Game', function(req, res){
    app.use(express.static(path.join(__dirname, 'src','game')));
    return res.sendFile(path.join(__dirname,'src','stramers','index.html'));
});

app.get('/', function(req, res){
    app.use(express.static(path.join(__dirname, 'src','stramers')));
    return res.sendFile(path.join(__dirname,'src','stramers','index.html'));
});

module.exports = app;