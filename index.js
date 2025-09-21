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
    const {email,password}=req.body;
    const salt= await bcrypt.genSalt(10);
    const hash= await bcrypt.hash(password,salt)

    try{
    const newuser = await user_model.create({
        email,
        password: hash
    });
    let token=jwt.sign({email},"secret");
    res.cookie("token",token);
    res.send("done");
    }
    catch(e){
        console.error(e);
    }
})
// app.post("/login",async (req,res)=>{
//     const {email,password,phone}=req.body;
//     const user=await user_model.findOne({email})
//     if (!user) return res.status(401).json({ success: false, message: "User not found" });

//         const match = await bcrypt.compare(password, user.password);
//         if (match) {
//             const token = jwt.sign({ email }, "secret", { expiresIn: '1h' });
//             res.cookie("token", token);
//             return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token})
//         }
//         else{
//             return res.status(401).json({ success: false, message: "Invalid password" });
//         }
           


// });
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password, phone } = req.body;

//     if (!password || (!email && !phone)) {
//       return res.status(400).json({ success: false, message: "Missing fields" });
//     }

//     // Find user by email or phone
//     const user = email
//       ? await user_model.findOne({ email })
//       : await user_model.findOne({ phone });

//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ success: false, message: "Invalid password" });
//     }

//     const token = jwt.sign({ id: user._id }, "secret", { expiresIn: '1h' });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         phone: user.phone,
//         name: user.name
//       }
//     });

//   } catch (error) {
//     console.error("Login Error:", error); // 👈 This will help you debug
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });
app.post("/login", async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    console.log("Incoming login request:");
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Password:", password);

    if (!password || (!email && !phone)) {
      console.log("Missing required fields.");
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const user = email
      ? await user_model.findOne({ email })
      : await user_model.findOne({ phone });

    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);

    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Login Error:", error); // 💥 This will show the exact error
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post("/logout",(req,res)=>{
    res.cookie("token","");
})
const PORT = process.env.PORT || 3000;
app.listen(PORT);
