'use strict'

var express = require('express');
var CardController = require("./controllers/Carta")

var router = express.Router();

var multipart = require("connect-multiparty");

var multiparMiddleware = multipart({UploadDir: "./uploads"})

//Rutes
router.get("/",CardController.home)  
router.get("/carta/:id?",CardController.getCard)  
router.get("/cartas",CardController.getCards)  

module.exports = router;