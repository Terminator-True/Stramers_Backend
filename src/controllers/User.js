'use strict'

const Usuario = require("../models/User");
const CryptoJS = require('crypto-js');
var session={};

function encryp(data, key="shjfi2857dkagr7"){
    return CryptoJS.AES.encrypt(data, key).toString();
}

function decryp(data, key="shjfi2857dkagr7"){
    var wA= CryptoJS.AES.decrypt(data, key);
    return wA.toString(CryptoJS.enc.Utf8);
}

var controller = {
    login: function(req, res){
        let username = req.body.username;
        let password = req.body.password;
        Usuario.findOne({ email: username },'password')
            .then(pswd => {
                if(decryp(pswd.password)!=password){
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
        user.password = encryp(params.password)    
        user.cartas = {}
        user.mazos = {}
        user.moneda = 0
        user.save(userStored)
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