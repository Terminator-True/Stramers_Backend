'use strict'

const Carta = require("../models/Carta");
const fs = require("fs");
const path = require("path")
let DailyCardsArray=[];

function DailyCards() {
    Carta.aggregate([
        {$match:{category: "Comun"}},
        {$sample:{size: 2}}
    ])
        .then(cards => { 
            DailyCardsArray.push(cards);
        })    
     Carta.aggregate([
        {$match:{category: "Raro"}},
        {$sample:{size: 2}}
    ])
        .then(cards => { 
            DailyCardsArray.push(cards);
        })
    Carta.aggregate([
        {$match:{category: "Epica"}},
        {$sample:{size: 1}}
    ])
        .then(cards => { 
            DailyCardsArray.push(cards);
        })
        console.log(DailyCardsArray)
    return DailyCardsArray;
}
DailyCardsArray=DailyCards()

setInterval(()=>{
    DailyCardsArray=DailyCards()
},86400000)
        

var controller = {
    home: function( req, res){
        return res.status(200).send({
            message:'pagina'
        });
    },
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
    getCards: function(req, res){
        Carta.find({})
            .then(cards => {
                return res.status(200).send({cards});

            })
            .catch(err =>{
                return res.status(500).send({message: "Error al retornar les dades"})
            })

    },
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
    getDailyCards: function(req,res){
        return res.status(200).send({DailyCardsArray});
    },
};

module.exports = controller;