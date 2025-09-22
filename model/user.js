import mongoose from 'mongoose';

const user_schema=new mongoose.Schema({
    email:String,
    password:String,
    phone:Number,
    department:String

});
const user_model=mongoose.model('user',user_schema,"employee")
export default user_model