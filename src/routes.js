'use strict'

var express = require('express');
var CardController = require("./controllers/Carta")

var router = express.Router();
//Paquete necesario para poder subir archivos por post
var multipart = require("connect-multiparty");
//Especificamos la rita de descarga
var multiparMiddleware = multipart({uploadDir: "./src/uploads"})

//Rutas
router.get("/",CardController.home)
//Busca carta por id  
router.get("/carta/:id?",CardController.getCard)  
//Devuelve todas las cartas
router.get("/cartas",CardController.getCards) 
//Añade carta a la base de datos 
router.post("/+carta",CardController.saveCard)  
//Borra la carta pasada por parámetro
router.delete("/cartas/:id?",CardController.deleteCard) 
//Pujar foto de la carta
router.post("/upload-image/:id",multiparMiddleware,CardController.uploadImage)
//Actualizar carta
router.put("/modifica/:id?",CardController.updateCard)  

module.exports = router;