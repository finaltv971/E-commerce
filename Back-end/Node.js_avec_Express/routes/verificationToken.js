const jwt = require('jsonwebtoken')

const verification = (req,res,next)=>{

        const authHeader = req.headers.authorization;
        console.log(req.headers.authorization)
        if (authHeader){
            const token = authHeader.split(" ")[1]
            jwt.verify(token,process.env.JWTSECRET,(err,user)=>{
                if(err) res.status(403).json('token invalide');
                req.user = user
                next()
            });

        }else{
            return res.status(401).json('Pas authentifier.')
        }
}
const verificationEtAutorisation = (req,res,next)=>{
    verification(req,res,()=>{
        if (req.user.id == req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json('pas autoriser')
        }
    })
}
const verificationEtAdmin = (req,res,next)=>{
    verification(req,res,()=>{
        if (req.user.isAdmin){
            next()
        }else{
            res.status(403).json('pas autoriser')
        }
    })
}
module.exports = {
    verification,
    verificationEtAutorisation,
    verificationEtAdmin
}