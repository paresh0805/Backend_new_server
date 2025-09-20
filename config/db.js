// const mongoose=require('mongoose')
// const connection=mongoose.connect("mongodb+srv://sandhukirat482:kirat9855@cluster0.bbnbwwp.mongodb.net/").then(()=>{
//      console.log("connected");
    
//  })
//  module.exports=connection
const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://sandhukirat482:kirat9855@cluster0.bbnbwwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
module.exports=connection
