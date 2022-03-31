'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UserSchema = schema({
    nick: String,
    email: String,
    password: {},
    cartas: {},
    mazos: {},
    moneda:String
});

module.exports = mongoose.model('Usuarios', UserSchema)