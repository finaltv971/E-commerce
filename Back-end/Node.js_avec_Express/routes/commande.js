const express = require('express');
const router = express.Router();
const Commande = require('../models/Commande')
const {verificationEtAutorisation, verificationEtAdmin} = require('./verificationToken')

/* create produit listing. */
router.post('/',verificationEtAdmin, async function(req, res, next) {

	const commande = new Commande(req.body);

	console.log(req.body)
    try {

        const commandeSav = await commande.save()
        console.log(commandeSav)
        res.status(200).json(commandeSav)

    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }

});

/* update produit listing. */
router.put('/:id',verificationEtAdmin, async function(req, res, next) {

	try {

		const commandeUpdated = await Commande.findByIdAndUpdate(req.params.id,{
			$set : req.body
		},
		{
			new:true
		}
	)

	res.status(200).json(commandeUpdated)

	} catch (error) {
		console.error(error)
		res.status(500).json(error)
	}

});

/* delete produit listing. */
router.delete('/:id', verificationEtAdmin,async function(req, res, next) {

	try {
		await Commande.findByIdAndDelete(req.params.id)
		res.status(200).json('commande supprimé')
	} catch (error) {
		res.status(500).json(error)
	}
});

/* GET USER Commandes. */
router.get('/find/:userId', verificationEtAutorisation, async function(req, res, next) {

	try {

		const commande = await Commande.find({
      userId:req.params.userId
    })
	
		res.status(200).json(commande) 

	} catch (error) {
		res.status(500).json(error) 
	}

});

/* GET all item  listing. */
router.get('/', verificationEtAdmin, async function(req, res, next) {
	try {

    const commande =  await Commande.find()
		res.status(200).json(commande) 

	} catch (error) { 
		res.status(500).json(error) 
	}

});


router.get('/stats', verificationEtAdmin, async function(req, res, next) {

	const date = new Date()
	const lastMonth = new Date(date.setMonth(date.getMonth()-1))
	const previousMonth = new Date(date.setMonth(date.getMonth()-2))

	try {
		const data = await Commande.aggregate([
			{
				$match:{
					createdAt : {
						$gte : previousMonth 
					}
				}
			},
			{
				$project : {
					month : {
						$month : "$createdAt"
					},
          			ventes : "$montant"
				}
			},
			{
				$group : {
					_id : "$month",
					total : { 
						$sum : "$ventes"
					}
				}
			}
		])
	
		res.status(200).json(data) 

	} catch (error) {

		res.status(500).json(error) 
		
	}

});

module.exports = router;
