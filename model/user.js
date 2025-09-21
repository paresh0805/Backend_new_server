const mongoose= require('mongoose')
const user_schema=new mongoose.Schema({
    email:String,
    password:String,
    phone:Number,

});
const user=mongoose.model('user',user_schema)
export default user



