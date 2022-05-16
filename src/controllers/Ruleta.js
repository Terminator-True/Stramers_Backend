//Importación de los paquetes necesarios para poder 
//navegar por las carpetas locales
const fs = require("fs");
const path = require("path")

// Controlador de recursos para la ruleta
var controller = {
    /**
     * Función que devuelve una respuesta http con el recurso
     * especificado por parámetro
     * @param Resource 
     */
    getResource: function(req,res){
        var file = req.params.img
        var path_file = "./src/ruleta/"+file
        fs.exists(path_file, (exists)=>{
            if (exists) {
                return res.sendFile(path.resolve(path_file))
            }else{
                return res.status(200).send({message: "No existeix la imatge"})
            }
        })
    }
};
module.exports = controller;