'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CardSchema = schema({
    name: String,
    category: String,
    type: String,
    coste: Number,
    dmg: Number,
    vida: Number,
    text: String,
    obtenible: Boolean,
    img:String
});

module.exports = mongoose.model('Carta', CardSchema)