const express = require('express');
const router = express.Router();
const User = require('../models/User')
const {verificationEtAutorisation, verificationEtAdmin} = require('./verificationToken')

/* update users listing. */
router.put('/:id',verificationEtAutorisation, async function(req, res, next) {

    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET).toString()
    }

	try {

		const userUpdated = await User.findByIdAndUpdate(req.params.id,{
			$set : req.body
		},
		{
			new:true
		}
	)

	res.status(200).json(userUpdated)

	} catch (error) {
		console.error(error)
		res.status(500).json(error)
	}

});

/* delete users listing. */
router.delete('/:id', async function(req, res, next) {

	try {
		await User.findByIdAndDelete(req.params.id)
		res.status(200).json('utilisateur supprimé')
	} catch (error) {
		res.status(500).json(error)
	}
});

/* GET user. */
router.get('/find/:id', verificationEtAdmin, async function(req, res, next) {

	try {

		const user = await User.findById(req.params.id)

		const { password, ...others } = user._doc;
	
		res.status(200).json(others) 

	} catch (error) {
		res.status(500).json(error) 
	}

});
/* GET users listing. */

router.get('/', verificationEtAdmin, async function(req, res, next) {

	const query = req.query.new
	try {

		const users = query ? await User.find().sort({_id : - 1}).select(" -password").limit(5) : await User.find().select(" -password")
	
		res.status(200).json(users) 

	} catch (error) {
		res.status(500).json(error) 
	}

});

router.get('/stats', verificationEtAdmin, async function(req, res, next) {

	const date = new Date()
	const lastYear = new Date(date.setFullYear(date.getFullYear()-1))

	try {



		const data = await User.aggregate([
			{
				$match:{
					createdAt : {
						$gte : lastYear 
					}
				}
			},
			{
				$project : {
					month : {
						$month : "$createdAt"
					}
				}
			},
			{
				$group : {
					_id : "$month",
					total : { 
						$sum : 1
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
