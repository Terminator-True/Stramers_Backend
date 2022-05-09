const fs = require("fs");
const path = require("path")

var controller = {
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