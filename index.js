// const express=require('express');
// const bcrypt=require('bcrypt');
// const jwt=require('jsonwebtoken')
// const user_model=require('./model/user.js')


// const app=express();
// app.use(express.json());

// app.get("/",(req,res)=>{
//     res.cookie("hello","world");
//     res.send("done");
// })
// app.post("/signup",async (req,res)=>{
//     const {email,password,phone}=req.body;
//     const salt= await bcrypt.genSalt(10);
//     const hash= await bcrypt.hash(password,salt)

//     try{
//     const newuser = await user_model.create({
//         email,
//         password: hash
//     });
//     let token=jwt.sign({email},"secret");
//     res.cookie("token",token);
//     }
//     catch(e){
//         console.error(e);
//     }
// })
// app.post("/login",async (req,res)=>{
//     const {email,password,phone}=req.body;
//     const user=await user_model.findOne({email})
//     if (!user) return res.send("User not found");

//         const match = await bcrypt.compare(password, user.password);
//         if (match) {
//             const token = jwt.sign({ email }, "secret", { expiresIn: '1h' });
//             res.cookie("token", token);
//         }
//         else{
//             res.send("User not found");
//         }
           


// });
// app.post("/logout",(req,res)=>{
//     res.cookie("token","");
// })
// app.listen(3000);
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import User from "./model/user.js";

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// ✅ Environment Variables from Railway
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("✅ Auth server is running!");
});

// 📝 Signup
app.post("/signup", async (req, res) => {
  const { email, password, phone, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, phone, name });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3600000
    });

    res.status(201).json({ success: true, user: { id: user._id, email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

// 🔐 Login
app.post("/login", async (req, res) => {
  const { email, password, phone } = req.body;
  if (!password || (!email && !phone)) {
    return res.status(400).json({ message: "Missing login credentials" });
  }

  try {
    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ phone });

    if (!user) return res.status(401).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3600000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🚪 Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  res.status(200).json({ message: "Logged out" });
});

// 🔐 Protected route
app.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});