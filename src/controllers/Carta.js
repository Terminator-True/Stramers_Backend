'use strict'
//Importación del modelo 
const Carta = require("../models/Carta");

//Import de paquetes necesarios para poder subir 
//archivos al server
const fs = require("fs");
const path = require("path")

//Definición de variables
let DailyCardsArray=[];
let RouletteCardsArray=[];


/**
 * Función que llena la array DailyCardsArray con cartas aleatorias
 * destinadas a la tienda
 *  - 2 comunes
 *  - 2 Raras
 *  - 1 Epica
 */
function DailyCards() {
    Carta.aggregate([
        {$match:{category: "Comun",obtenible:true}},
        {$sample:{size: 2}}
    ])
        .then(cards => { 
            DailyCardsArray.push(cards);
        })    
     Carta.aggregate([
        {$match:{category: "Raro",obtenible:true}},
        {$sample:{size: 2}}
    ])
        .then(cards => { 
            DailyCardsArray.push(cards);
        })
    Carta.aggregate([
        {$match:{category: "Epica",obtenible:true}},
        {$sample:{size: 1}}
    ])
        .then(cards => { 
            DailyCardsArray.push(cards);
        })
        console.log(DailyCardsArray)
    return DailyCardsArray;
}

/**
 * Función que llena la array RouletteCardsArray con cartas aleatorias destinadas
 * a la ruleta:
 *  - 2 comunes
 *  - 2 Raras
 *  - 1 Epica
 *  - 1 Legendaria
 */
function RouletteCards() {
    Carta.aggregate([
        {$match:{category: "Comun",obtenible:true}},
        {$sample:{size: 2}}
    ])
        .then(cards => { 
            RouletteCardsArray.push(cards);
        })   
        setTimeout(() => {
            Carta.aggregate([
                {$match:{category: "Raro",obtenible:true}},
                {$sample:{size: 2}}
            ])
                .then(cards => { 
                    RouletteCardsArray.push(cards);
                })
        }, 250); 
        setTimeout(() => {
            Carta.aggregate([
                {$match:{category: "Epica",obtenible:true}},
                {$sample:{size: 1}}
            ])
                .then(cards => { 
                    RouletteCardsArray.push(cards);
                })
        }, 500);
        setTimeout(() => {
            Carta.aggregate([
                {$match:{category: "Legend",obtenible:true}},
                {$sample:{size: 1}}
            ])
                .then(cards => { 
                    RouletteCardsArray.push(cards);
                })  
        }, 750);
    
}

// Se llaman a las dos funciones para que al iniciar el servicio
// las arrays estén listas para su uso
RouletteCards()     
DailyCards()

/**
 * Se renuevan las arrays con cartas nuevas:
 *  -La ruleta se renueva cada minuto
 *  -Las cartas de la tienda se renuevan cada 24 h
 */
setInterval(()=>{
    RouletteCardsArray=[];
    RouletteCards()        
},60000)

setInterval(()=>{
    DailyCardsArray=[];
    DailyCards()
},86400000)
        
/**
 * Controlador de Carta
 */
var controller = {

    /**
     * @param Id Id de la carta 
     * @returns la carta correspondiente segñun el id pasado por parámetro
     */
    getCard: function(req, res){
        var Id = req.query.id;
        //console.log(Id)
        if(Id==null) return res.status(500).send({message:"no has especificat carta"});
        else{
            Carta.findById(Id)
                .then(card => { 
                        console.log(card)                   
                        if(!card) return res.status(404).send({message:"Carta no existent"});

                        return res.status(200).send({card});

                })
                .catch( err => {
                        return res.status(500).send({message:"Error al retornar les dades"});
                });
        }

    }, 
    /**
     * @return Devuelve todas las cartas existientes en la base de datos
     */
    getCards: function(req, res){
        Carta.find({})
            .then(cards => {
                return res.status(200).send({cards});

            })
            .catch(err =>{
                return res.status(500).send({message: "Error al retornar les dades"})
            })

    },
    /**
     * Recive una carta nueva, con todas sus características y
     * la guarda en la base de datos
     * @param params: 
     *  @var name
     *  @var category Categoría de la carta: Epica,Rara,Común o Legendaria
     *  @var type Hechizo o Esbirro
     *  @var coste 
     *  @var dmg
     *  @var vida
     *  @var text Descripción corta de lo que hace la carta
     *  @var obtenible Depenent de si es pot obtenir o no es true o false
     *  @var img Nombre de la imagen
     */
    saveCard:  function( req, res ){
        var card = new Carta();
        var params = req.body;

        card.name = params.name
        card.category = params.category
        card.type = params.type    
        card.coste = params.coste
        card.dmg = params.dmg
        card.vida = params.vida
        card.text=params.text
        card.obtenible=params.obtenible
        card.img = params.img
        console.log(card)
        card.save()
            .then(cardStored=>{
                if(!cardStored) return res.status(404).send({message: "Document no desat"});

                return res.status(200).send({card: cardStored});
            })
            .catch(err => {
                return res.status(500).send({message: "Error desant dades"});
            })

    },
    /**
     * Elimina la carta especificada por parámetro
     * @param Id 
     */
    deleteCard: function(req, res){
        var Id = req.query.id;
        Carta.findByIdAndDelete(Id)
            .then(cardRemoved => {
                if(!cardRemoved) return res.status(404).send({message:"La carta a borrar no existeix"});

                return res.status(200).send({project:cardRemoved});
            })
            .catch(err => {
                return res.status(500).send({message:"Error no s\'ha pogut  borrar la carta"});
            })

    },
    /**
     * Sube una imagen y la asigna a la carta de la ID pasada 
     * por parámetro
     * @param Id 
     */
    uploadImage: function(req, res){
        var Id = req.params.id;
        var fileName = "imatge no pujada"
        console.log(req.files)
        if(req.files){
            var filePath = req.files.img.path
            var filesplit=filePath.split("\\")
            var fileName=filesplit[2]
            Carta.findByIdAndUpdate(Id, {img:fileName}, {new:true})
                .then(cardUpdated=> {
                    if(!cardUpdated) return res.status(404).send({message:"La carta no existeix"});

                    return res.status(200).send({card:cardUpdated});
                })   
                .catch(err =>{
                    return res.status(500).send({message:"Error actualitzant la imatge"});
                }) 
        }else{
            return res.status(500).send({message:fileName})
        }
    },
    /**
     * Actualiza la carta especificada por parámetro
     * @param ID 
     */
    updateCard: function(req, res){
        var Id = req.params.id;
        var update = req.body;
        Carta.findByIdAndUpdate(Id, update, {new:true})
            .then(cardtUpdated => {
                if(!projectUpdated) return res.status(404).send({message:"La carta no existeix"});
                return res.status(200).send({project:cardtUpdated});
            })
            .catch(err => {
                return res.status(500).send({message:"Error actualitzant les dades"});
            })
    },
    /**
     * Devuelve la imagen especificada por parámetro
     * @param img string con el nombre de la imagen
     */
    getImage: function(req,res){
        var file = req.params.img
        var path_file = "./src/uploads/"+file
        //console.log(path_file)
        fs.exists(path_file, (exists)=>{
            if (exists) {
                return res.sendFile(path.resolve(path_file))
            }else{
                return res.status(200).send({message: "No existeix la imatge"})
            }
        })
    },
    /**
     * Devuelve todas las cartas de el tipo que se especifica por parámetro
     * @param Type tipo de la carta: Hechizo, Esbirro
     */
    getCardsByType: function(req, res){
        var type = req.params.type;
        console.log(type)
        if(type==null) return res.status(500).send({message:"no has especificat carta"});
        else{
            Carta.find({type: type})
                .then(cards => { 
                        console.log(cards)                   
                        if(!cards) return res.status(404).send({message:"Carta no existent"});

                        return res.status(200).send({cards});

                })
                .catch( err => {
                        return res.status(500).send({message:"Error al retornar les dades"});
                });
        }
    },
    /**
     * Devuelve todas las cartas de la categoría que se especifica por parámetro
     * @param Category categoría de la carta: Común,Épica,Legendaria,Rara
     */
    getCardsByCateg: function(req, res){
        var category = req.params.category;
        console.log(category)
        if(category==null) return res.status(500).send({message:"no has especificat carta"});
        else{
            Carta.find({category: category})
                .then(cards => { 
                        console.log(cards)                   
                        if(!cards) return res.status(404).send({message:"Carta no existent"});

                        return res.status(200).send({cards});

                })
                .catch( err => {
                        return res.status(500).send({message:"Error al retornar les dades"});
                });
        }
    },
    /**
     * Devuelve una array con las cartas destinadas a la tienda
     */
    getDailyCards: function(req,res){
        return res.status(200).send({DailyCardsArray});
    },
    /**
     * Devuelve una array con las cartas destinadas a la ruleta
     */
    getRouletteCards: function(req,res){
        return res.status(200).send(RouletteCardsArray);
    },
};

module.exports = controller;