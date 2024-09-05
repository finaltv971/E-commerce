const mongoose = require("mongoose")

const produitSchema = new mongoose.Schema(
    {
        nom : {
            type : String,
            required : true,
            unique : true
        },
        description : {
            type : String,
            required : true,
        },
        img : {
            type : String,
            required : true,
        },
        categories : {
            type : Array,
        },
        taille : {
            type : String,
        },
        couleur : {
            type : String,
        },
        prix : {
            type : Number,
            required : true,
        },
    },{timestamps : true}
) 
module.exports = mongoose.model('Produit',produitSchema)