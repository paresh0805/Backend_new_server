const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const user_model=require('./model/user.js')


const app=express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.cookie("hello","world");
    res.send("done");
})
app.post("/signup",async (req,res)=>{
    const {email,password,phone}=req.body;
    const salt= await bcrypt.genSalt(10);
    const hash= await bcrypt.hash(password,salt)

    try{
    const newuser = await user_model.create({
        email,
        password: hash
    });
    let token=jwt.sign({email},"secret");
    res.cookie("token",token);
    }
    catch(e){
        console.error(e);
    }
})
app.post("/login",async (req,res)=>{
    const {email,password,phone}=req.body;
    const user=await user_model.findOne({email})
    if (!user) return res.send("User not found");

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ email }, "secret", { expiresIn: '1h' });
            res.cookie("token", token);
        }
        else{
            res.send("User not found");
        }
           


});
app.post("/logout",(req,res)=>{
    res.cookie("token","");
})
app.listen(3000);
