const mongoose = require("mongoose")

const commandeSchema = new mongoose.Schema(
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
        montant : {
            type: Number,
            required : true
        },
        adresse : {
            type : Object,
            required : true
        },
        status : {
            type : String,
            default: 'En attente'
        }
    },
    {timestamps : true}
) 
module.exports = mongoose.model('Commande',commandeSchema)