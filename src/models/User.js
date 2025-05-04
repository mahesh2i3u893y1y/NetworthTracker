
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });



userSchema.methods.getJwt = async function(){
    const user = this 
    const token = await jwt.sign({_id:user._id},"User@Token",{expiresIn:"1h"})
    return token
}

userSchema.methods.validatePassword = async function(password){
    const user = this 
    const hashedPassword = user.password 

    const isValid = await bcrypt.compare(password,hashedPassword)

    return isValid
}


module.exports = mongoose.model('Users', userSchema);





