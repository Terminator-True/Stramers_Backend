'use strict'

const Usuario = require("../models/User");
const BeginCard= require("../begincard/begincard.json");
var session={};

// Importación de el paquete de encriptación
const crypto = require('crypto');
//Algoritmo utilizado para encriptar
const algorithm = 'aes-256-ctr';
//Clave secreta general para desencriptar
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
//Clave generada automáticamente
const iv = crypto.randomBytes(16);

/**
 * Función que encripta un texto pasado por parámetro
 * @param {*} text texto a encriptar
 * @returns Un objeto con el codigo Iv necesario para desencriptar y la propia password encriptada
 */
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}
/**
 * Función que desencripta un texto pasado por parámetro
 * @param hash un objeto con el codigo Iv necesario para desencriptar y la propia password encriptada
 * @returns La password desencriptada
 */
function decrypt(hash) {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

var controller = {
    login: function(req, res){
        let username = req.body.email;
        let password = req.body.pasw;
        Usuario.findOne({ email: username })
            .then(user => {
                //console.log(user)
                if(decrypt(user.password)!=password){
                    return res.status(404).send({message:"Error, password incorrecte"});
                } else{
                    session.user = user;
                    return res.status(200).send({session});
                }
            })
            .catch(err => {
                return res.status(500).send({message:"Error user incorrecte"});
            })
    },
    register:  function( req, res ){
        var user = new Usuario();
        var params = req.body;

        user.nick = params.nick
        user.email = params.email
        user.password = encrypt(params.pasw)  
        user.moneda = 0
        user.cartas = BeginCard
        user.mazos = {"Defaul Deck":["facturas","twitch","dalas","horcus","raid","momoladinastia","tonacho","streamer","hot_tub_streamer","garmy","otaku","mldr","barbeq","bigchungus","lucille"]}
        user.mazo = ["facturas","twitch","dalas","horcus","raid","momoladinastia","tonacho","streamer","hot_tub_streamer","garmy","otaku","mldr","barbeq","bigchungus","lucille"]
        user.save()
            .then(userStored=>{
                if(!userStored) return res.status(404).send({message: "Document no desat"});

                return res.status(200).send({user: userStored});
            })
            .catch(err => {
                return res.status(500).send({message: "Error desant dades"});
            })

    },
    updateUser: function(req, res){
        var password = req.body.passwd
        var nick = req.params.nick;
        var update = req.body;
        Usuario.findOneAndUpdate({ nick: nick }, update,{new:true})
            .then(userUpdated => {
                if(decrypt(userUpdated.password)!=password){
                    return res.status(404).send({message:"Error, password incorrecte"});
                } else{
                    return res.status(200).send("ok");
                }
            })
            .catch(err => {
                return res.status(500).send({message:"Error actualitzant les dades"});
            })
    },
    getMoney: function(req, res){
        var nick = req.params.nick;
        if(nick==null) return res.status(500).send({message:"no has especificat usuari"});
        else{
            Usuario.find({nick: nick })
                .then(user => { 
                        let moneda = user[0].moneda
                        if(!user) return res.status(404).send({message:"Usuari no existent"});
                        //console.log(moneda)
                        return res.status(200).send({moneda});

                })
                .catch( err => {
                        return res.status(500).send({message:"Error al retornar les dades"});
                });
        }

    },
    updateMoney: function(req, res){
        var nick = req.params.nick;
        var update = req.body;
        console.log(update)
        Usuario.findOneAndUpdate({ nick: nick }, update,{new:true})
            .then(moneyUpdated => {
                if(!moneyUpdated) return res.status(404).send({message:"L'usuari no existeix"});
                return res.status(200).send({moneda:moneyUpdated});
            })
            .catch(err => {
                return res.status(500).send({message:"Error actualitzant les dades"});
            })
    },
    getCards: function(req, res){
        var nick = req.params.nick;
        if(nick==null) return res.status(500).send({message:"no has especificat usuari"});
        else{
            Usuario.find({nick: nick })
                .then(user => { 
                        let cartes = user[0].cartas
                        if(!user) return res.status(404).send({message:"Usuari no existent"});
                        //console.log(moneda)
                        return res.status(200).send({cartes});

                })
                .catch( err => {
                        return res.status(500).send({message:"Error al retornar les dades"});
                });
        }

    },
    updateCards: function(req, res){
        var nick = req.params.nick;
        var update = req.body;
        console.log(update)
        Usuario.findOneAndUpdate({ nick: nick }, update,{new:true})
            .then(CardUpdate => {
                console.log(CardUpdate)
                if(!CardUpdate) return res.status(404).send({message:"L'usuari no existeix"});
                return res.status(200).send({cards:CardUpdate});
            })
            .catch(err => {
                return res.status(500).send({message:"Error actualitzant les dades"});
            })
    },
     updateDeck: function(req, res){
        var nick = req.params.nick;
        var update = req.body;
        console.log(update)
        Usuario.findOneAndUpdate({ nick: nick }, update,{new:true})
            .then(DeckUpdate => {
                if(!DeckUpdate) return res.status(404).send({message:"L'usuari no existeix"});
                return res.status(200).send({mazos:DeckUpdate});
            })
            .catch(err => {
                return res.status(500).send({message:"Error actualitzant les dades"});
            })
    },
    getDecks: function(req, res){
        var nick = req.params.nick;
        if(nick==null) return res.status(500).send({message:"no has especificat usuari"});
        else{
            Usuario.find({nick: nick })
                .then(user => { 
                        let mazos = user[0].mazos
                        if(!user) return res.status(404).send({message:"Usuari no existent"});
                        //console.log(moneda)
                        return res.status(200).send({mazos});

                })
                .catch( err => {
                        return res.status(500).send({message:"Error al retornar les dades"});
                });
        }

    },
}
module.exports = controller;