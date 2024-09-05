const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit')
const {verificationEtAutorisation, verificationEtAdmin} = require('./verificationToken')

/* create produit listing. */
router.post('/',verificationEtAdmin, async function(req, res, next) {

	let produit = new Produit(req.body);

	console.log(req.body)
    try {

        produit = await produit.save()
        console.log(produit)
        res.status(200).json(produit)

    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }

});

/* update produit listing. */
router.put('/:id',verificationEtAdmin, async function(req, res, next) {

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
router.delete('/:id', verificationEtAdmin,async function(req, res, next) {

	try {
		await Produit.findByIdAndDelete(req.params.id)
		res.status(200).json('produit supprimé')
	} catch (error) {
		res.status(500).json(error)
	}
});

/* GET specific produit. */
router.get('/find/:id', verificationEtAutorisation, async function(req, res, next) {

	try {

		const produit = await Produit.findById(req.params.id)
	
		res.status(200).json(produit) 

	} catch (error) {
		res.status(500).json(error) 
	}

});

/* GET users listing. */
router.get('/all', verificationEtAutorisation, async function(req, res, next) {

	const qNew = req.query.new
	const qCategory = req.query.category

	try {

		let produit;
		if(qNew){
			produit =  await Produit.find().sort({_id : - 1}).limit(1) 

		}
		else if(qCategory){

			produit =  await Produit.find({

				categories:{

					$in:[qCategory]

				}

			}).sort({createdAt : - 1})

		}

		else{

			produit = await Produit.find().sort({createdAt : - 1})

		}

		res.status(200).json(produit) 

	} catch (error) { 
		res.status(500).json(error) 
	}

});


module.exports = router;
