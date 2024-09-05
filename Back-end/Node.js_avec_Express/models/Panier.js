const mongoose = require("mongoose")

const panierSchema = new mongoose.Schema(
    {
        userId : {
            type : String,
            required : true,
        },
        produits : [
            {
                produitId :{
                    type : String,
                },
                quantite : {
                    type : Number,
                    default : 1
                }
            }
        ],

    },
    {timestamps : true}
) 
module.exports = mongoose.model('Panier',panierSchema)