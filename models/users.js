const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required:true,
    },
    lastname: {
        type:String,
        required:[true,'Lastname cannot be empty']

    },
    username:{
        type: String,
        required:true,
        minlength:6
    },
    email: { type:String, required:[true,'Email cannot be empty'] },
    password: { type:String, required:true }
})

module.exports = mongoose.model("Users",UserSchema)