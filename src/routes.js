'use strict'

var express = require('express');
var CardController = require("./controllers/Carta")
var UserController = require("./controllers/User")
var RuletaController = require("./controllers/Ruleta")
var ImagesController = require("./controllers/Images")


var router = express.Router();
//Paquete necesario para poder subir archivos por post
var multipart = require("connect-multiparty");
//Especificamos la rita de descarga
var multiparMiddleware = multipart({uploadDir: "./src/uploads"})

//-------------------
//Rutas Cartas
//-------------------
router.get("/",CardController.home)
//Busca carta por id  
router.get("/carta/:id?",CardController.getCard)  
//Devuelve todas las cartas
router.get("/cartas",CardController.getCards) 
//Devuelve la imagen de una carta
router.get("/get-image/:img",CardController.getImage)
//Añade carta a la base de datos 
router.post("/save-carta",CardController.saveCard)  
//Borra la carta pasada por parámetro
router.delete("/cartas/:id?",CardController.deleteCard) 
//Pujar foto de la carta
router.post("/upload-image/:id",multiparMiddleware,CardController.uploadImage)
//Actualizar carta
router.put("/modifica/:id?",CardController.updateCard) 
//Demana la rotació de cartes diaries
router.get("/daily",CardController.getDailyCards)

//-------------------
//Rutas Users
//-------------------
//Login
router.post("/login",UserController.login)
//Register
router.post("/register",UserController.register)
//Get money
router.get("/get-money/:nick?",UserController.getMoney)
//Update money
router.put("/new-money/:nick?",UserController.updateMoney)
//Get cartes desbloquejades
router.get("/get-cards/:nick?",UserController.getCards)
//Update per al mall
router.put("/updeck/:nick?",UserController.updateDeck)
//Get per a tots els malls
router.get("/get-decks/:nick?",UserController.getDecks)
//Update per les cartes
router.put("/updateCards/:nick?",UserController.updateCards)



//-------------------
//Rutas Ruleta
//-------------------
router.get("/get-image-roulete/:img",RuletaController.getImage)

router.get("/get-card-roulette/",CardController.getRouletteCards)


//-------------------
//Rutas Images
//-------------------
router.get("/get-image-ico/:img",ImagesController.getImage)

module.exports = router;