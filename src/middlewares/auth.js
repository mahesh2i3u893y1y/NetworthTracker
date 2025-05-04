const jwt = require("jsonwebtoken")
const Users = require("../models/User")


const authMiddleWare = async (req,res,next) => {
    try{
        const {token} = req.cookies 
        if(!token){
          return  res.status(401).json({message:"Please Login!!"}) 
        }

        const decodedData = await jwt.verify(token,"User@Token")
        const {_id} =  decodedData 
        const user = await Users.findById(_id)
        if(!user){
            throw new Error("User not found!!")
        }
        req.user = user
        next()

    }catch(err){
        res.status(400).json({message : err.message})
    }
}



module.exports = {authMiddleWare}