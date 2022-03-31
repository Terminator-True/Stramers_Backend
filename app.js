'use strict'

var express = require("express");
var bodyParser = require("body-parser");
const sessions = require('express-session');
var _routes = require("./src/routes")

var app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

//Sessió
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    resave: false
}));

//CORS
app.use((req, res, next) => {
    //Fa que els recursos de la resposta puguin ser compartits per tots (*) 
    res.header('Access-Control-Allow-Origin' , '*');
    // Indica quins encapçalats HTTP poden ser utilitzats en aquesta sol·licitut
    res.header('Access-Control-Allow-Headers' , 'Authorization, X-API-KEY,Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method' );
    //Especificació dels métodes acceptats
    res.header('Access-Control-Allow-Methods' , 'GET, POST, OPTIONS, PUT,DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE' );
    next();
   });

//Rutes
app.use("/api",_routes)
module.exports = app;