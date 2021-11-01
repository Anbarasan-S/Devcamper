const mongoose=require('mongoose');


const USER=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    date:
    {
        type:String,
        default:Date.now
    }
});

module.exports=mongoose.model('Schema',USER);