'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CardSchema = schema({
    name: String,
    category: String,
    type: String,
    coste: Number,
    daño: Number,
    vida: Number,
    text: String,
    funcion: String,
    img:String
});

module.exports = mongoose.model('cartas', CardSchema)