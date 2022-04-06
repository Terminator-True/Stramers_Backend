'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var _routes = require("./src/routes")
const http = require("http").createServer(express);
const cors = require("cors");
const io = require("socket.io")(http);
var app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());


//CORS
app.use(cors())

//Rutes
app.use("/api",_routes)


module.exports = app;