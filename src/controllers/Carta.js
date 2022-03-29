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

        card.name=params.name
        card.category=params.category
        card.type=params.type    
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
    }/*,
    test:  function(req, res){
        return res.status(200).send({
            message:"pagina de test"
        })
    },
    saveProject:  function( req, res ){
        var project = new Project();
        var params = req.body;


        project.name=params.name
        project.description=params.description
        project.category=params.category
        project.year=params.year    
        project.langs = params.langs
        project.image = 'null'
        
        console.log(params)
        project.save(projectStored)
            .then(projectStored=>{
                if(!projectStored) return res.status(404).send({message: "Document no desat"});

                return res.status(200).send({project: projectStored});
            })
            .catch(err => {
                return res.status(500).send({message: "Error desant dades"});
            })

    },
    getProject: function(req, res){
        var projectId = req.params.id;
        console.log(projectId);

        if(projectId==null) return res.status(500).send({message:"no has especificat projecte"});
        else{
            Project.findById(projectId)
                .then(project => {                    
                        if(!project) return res.status(404).send({message:"El projecte no existeix"});

                        return res.status(200).send({project});

                })
                .catch( err => {
                        return res.status(500).send({message:"Error al retornar les dades"});
                });
        }

    },
    getProjects: function(req, res){
        Project.find({}).exec(projects)
            .then(projects => {
                return res.status(200).send({projects});

            })
            .catch(err =>{
                return res.status(500).send({message: "Error al retornar les dades"})
            })

    },
    updateProject: function(req, res){
        var projectId = req.params.id;

        var update = req.body;

        Project.findByIdAndUpdate(projectId, update, {new:true})
            .then(projectUpdated => {
                if(!projectUpdated) return res.status(404).send({message:"El projecte no existeix"});

                return res.status(200).send({project:projectUpdated});
            })
            .catch(err => {
                return res.status(500).send({message:"Error actualitzant les dades"});
            })
    },
    deleteProject: function(req, res){
        var projectId = req.params.id;

        Project.findByIdAndDelete(projectId)
            .then(projectRemoved => {
                if(!projectUpdated) return res.status(404).send({message:"El projecte a borrar no existeix"});

                return res.status(200).send({project:projectRemoved});
            })
            .catch(err => {
                return res.status(500).send({message:"Error no s\'ha pogut  borrar el projecte"});
            })

    },
    uploadImage: function(req, res){
        var projectId = req.params.id;
        var fileName = "imatge no pujada"

        if(req.files){
            var filePath = req.files.image.path
            var filesplit=filePath.split("/")
            var fileName=filesplit[1]
            Project.findByIdAndUpdate(projectId, {image:fileName}, {new:true})
                .then(projectUpdated=> {
                    if(!projectUpdated) return res.status(404).send({message:"El projecte no existeix"});

                    return res.status(200).send({project:projectUpdated});
                })   
                .catch(err =>{
                    return res.status(500).send({message:"Error actualitzant la imatge"});
                }) 
        }else{
            return res.status(500).send({message:fileName})
        }
    }*/
};

module.exports = controller;