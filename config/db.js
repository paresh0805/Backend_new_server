const mongoose=require('mongoose')
const connection=mongoose.connect("mongodb+srv://sandhukirat482:kirat9855@cluster0.bbnbwwp.mongodb.net/").then(()=>{
     console.log("connected");
    
 })
 module.exports=connection