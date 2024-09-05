const express = require('express');
const router = express.Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js");
const jwt =require('jsonwebtoken')

// AUTH


router.post('/inscription', async function(req, res, next) {

    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password,process.env.SECRET).toString(),
    })

    try {
        const savedUser = await newUser.save()
        console.log(savedUser)
        res.status(200).json(savedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }

});

router.post('/connexion', async function(req, res, next) {

    try {
        
        const user = await User.findOne({
            username : req.body.username,
        })
        
        !user && res.status(401).json("bad credential 1");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET
        )
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8)

        Originalpassword !== req.body.password && res.status(401).json("bad credential")

        const token = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin

        },
        process.env.JWTSECRET,
        {
            expiresIn:'2d'
        }
        )
        const { password, ...others } = user._doc;

        res.status(200).json({others,token}) 

    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }

});

module.exports = router;
