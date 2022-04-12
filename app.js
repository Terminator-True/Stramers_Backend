'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var _routes = require("./src/routes")
const cors = require("cors");

var app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());


//CORS
app.use(cors())

//Rutes
app.use("/api",_routes)


module.exports = app;