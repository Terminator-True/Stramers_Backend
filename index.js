'use strict'

var mongoose = require('mongoose');

var app = require("./app")
var port = 3700
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Stramers')
    .then(()=>{
        console.log("[+] BD connection ok");
        //Crea server
        app.listen(port,()=>{
            console.log("[+] Server Up")
        });
    })
    .catch(err => console.log(err));