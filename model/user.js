// import mongoose from 'mongoose';

// const user_schema=new mongoose.Schema({
//     email:String,
//     password:String,
//     phone:Number,
//     department:String

// });
// const user_model=mongoose.model('user',user_schema,"employee")
// export default user_model


import mongoose from 'mongoose';

const user_schema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },  // unique if present
  phone: { type: String, unique: true, sparse: true },  // unique if present
  password: { type: String, required: true },
  department: { type: String, required: true }
}, { timestamps: true });

const user_model = mongoose.model('User', user_schema, "employee");

export default user_model;
