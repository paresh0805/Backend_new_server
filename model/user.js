const mongoose= require('mongoose')
const user_schema=new mongoose.Schema({
    email:String,
    password:String,
    phone:Number,

});
const user_model=mongoose.model('user',user_schema)
module.exports=user_model