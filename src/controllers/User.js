'use strict'

const Usuario = require("../models/User");
var session={};

//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = "Secret123";
const iv = "sec";

//Encrypting text
function encrypt(text) {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
   let iv = Buffer.from(text.iv, 'hex');
   let encryptedText = Buffer.from(text.encryptedData, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}


var controller = {
    login: function(req, res){
        let username = req.body.email;
        let password = req.body.pasw;
        Usuario.findOne({ email: username },'password')
            .then(pswd => {
                console.log(decrypt(pswd.password.toString(),"secret123"))
                if(decrypt(pswd.password,"secret123")!=password){
                    return res.status(404).send({message:"Error, password incorrecte"});
                } else{
                    session.loggedin = true;
                    session.username = username;
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
        user.password = encrypt(params.password,"secret123")    
        user.cartas = {}
        user.mazos = {}
        user.moneda = 0
        user.save()
            .then(userStored=>{
                if(!userStored) return res.status(404).send({message: "Document no desat"});

                return res.status(200).send({user: userStored});
            })
            .catch(err => {
                return res.status(500).send({message: "Error desant dades"});
            })

    }
 
}
module.exports = controller;