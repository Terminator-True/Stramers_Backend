//Importación de los paquetes necesarios para poder 
//navegar por las carpetas locales
const fs = require("fs");
const path = require("path")

//Controlador de imagenes
var controller = {
    /**
     * Función que devuelve una respuesta http
     * con la imagen especificada por parámetro
     * 
     * @param Img Nom de la imatge 
     */
    getImage: function(req,res){
        var file = req.params.img
        var path_file = "./src/images/"+file
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