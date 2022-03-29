'use strict'

const Carta = require("../models/Carta");

var controller = {
    home: function( req, res){
        return res.status(200).send({
            message:'pagina'
        });
    },
    getCard: function(req, res){
        var Id = req.query.id;
        console.log(Id)
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
        card.daño = params.daño
        card.vida = params.vida
        card.text=params.text
        card.funcion=params.funcion
        card.image = 'null'
        card.save(cardStored)
            .then(cardStored=>{
                if(!cardStored) return res.status(404).send({message: "Document no desat"});

                return res.status(200).send({project: cardStored});
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
        if(req.files){
            var filePath = req.files.image.path
            var filesplit=filePath.split("/")
            var fileName=filesplit[1]
            Project.findByIdAndUpdate(Id, {image:fileName}, {new:true})
                .then(cardUpdated=> {
                    if(!cardUpdated) return res.status(404).send({message:"La carta no existeix"});

                    return res.status(200).send({project:cardUpdated});
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
    }
};

module.exports = controller;