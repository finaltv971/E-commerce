const express = require('express');
const router = express.Router();
const Panier = require('../models/Panier')
const {verificationEtAutorisation, verificationEtAdmin} = require('./verificationToken')

/* create produit listing. */
router.post('/',verificationEtAutorisation, async function(req, res, next) {

	let panier = new Panier(req.body);

	console.log(req.body)
    try {

        panier = await panier.save()
        console.log(panier)
        res.status(200).json(panier)

    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }

});

/* update produit listing. */
router.put('/:id',verificationEtAutorisation, async function(req, res, next) {

	try {

		const produitUpdated = await Produit.findByIdAndUpdate(req.params.id,{
			$set : req.body
		},
		{
			new:true
		}
	)

	res.status(200).json(produitUpdated)

	} catch (error) {
		console.error(error)
		res.status(500).json(error)
	}

});

/* delete produit listing. */
router.delete('/:id', verificationEtAutorisation,async function(req, res, next) {

	try {
		await Panier.findByIdAndDelete(req.params.id)
		res.status(200).json('produit supprimé')
	} catch (error) {
		res.status(500).json(error)
	}
});

/* GET specific produit. */
router.get('/find/:userId', verificationEtAutorisation, async function(req, res, next) {

	try {

		const panier = await Panier.findOne({
			userId : req.params.userId
		})
	
		res.status(200).json(panier) 

	} catch (error) {
		res.status(500).json(error) 
	}

});

/* GET all item  listing. */
router.get('/', verificationEtAdmin, async function(req, res, next) {
	try {
    	const panier =  await Panier.find()
		res.status(200).json(panier) 
	} catch (error) { 
		res.status(500).json(error) 
	}
});


module.exports = router;
