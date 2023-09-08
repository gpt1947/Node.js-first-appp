
//  import http from "http";
//  import fs from "fs";
//  import { ggg } from "./features.js";
// import path from "path";

//const home=fs.readFileSync("./index.html");
//console.log(home);
//console.log(path.);
// const server=http.createServer((req,res) =>{

//     if(req.url==="/about"){
//         res.end(`<>Love is ${ggg()render()
//         res.end("<h1>home</h1>");
    //    fs.readFile("./index.html",(err,home3)=>{
    //     res.end(home3);
    // });
    // res.end(home);
//     }
//    else if(req.url==="/contact"){
//         res.end("<h1>Contact Page</h1>");
//     }
//     else{
//         res.end("<h1>PAge not found</h1>");
//     }
// });

// server.listen(3000, ()=>{
//     console.log("server is working")
// });
//

//Express js

// import  express  from "express";
// import path from "path";

// const app =express();

// //setting up view engine
// app.set("view engine","ejs");

// app.get("/",(req,res)=>{
  
//   res.render("index");
// }); 

// app.listen(5000,()=>{
//     console.log("Server is Working");
// });

// const http=require("http");

// const server=http.createServer((req,res)=>{
//   if(req.url==="/"){
//    return  res.end("<h1>Home</h1>");
//   }
//  else if(req.url==="/About"){
//    return  res.end("<h1>About Page</h1>");
//   }
//  else if(req.url==="/Contact"){
//     return res.end("<h1>Contact</h1>");
//   }
//   else{
//    return  res.end("<h1>Page not Foumd </h1>");
//   }
// });

// server.listen(10000,()=>{
// console.log("i am working");
// });

import express from "express";
import path from "path";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


mongoose.connect("mongodb://127.0.0.1:27017",{
  dbname:"backand",
})
.then(()=>console.log("database connected"))
.catch((e)=>console.log(e));  

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);


const app = express();

//const users=[];

//using middlewears
 app.use(express.static(path.join(path.resolve() , "public")))
 app.use(express.urlencoded({extended:true}));
 app.use(cookieParser());


 app.set("view engine","ejs");


   const isauthenticated=async(req,res,next)=>{
    const {token} = req.cookies;
    if(token){
      const decoded = jwt.verify(token, "sdjasdbajsdbjasd");
      req.user = await User.findById(decoded._id);
       
     next();
    }
    else{
      res.redirect("/login");
    } 
   };

  app.get("/",isauthenticated,(req,res)=>{
    res.render("logout",{name:req.user.name});
  });

  app.get("/register",(req,res)=>{
    
    res.render("register");
  });

// app.get("/",(req, res)=>{
//   // const pathlocation=path.resolve();
//   // res.sendFile(path.join(pathlocation,"./index.html"));
//     res.render("login");

//     //  res.sendFile("index");
// });

app.post("/register",async(req,res)=>{
  const {name,email,password}=req.body;
     
  let user=await User.findOne({email});
  if(user){
    return res.render("login"); 
  }

  const hashedPassword = await bcrypt.hash(password, 10);
     user=await User.create({
      name,
      email,
      password:hashedPassword;
    });

    const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
    
    res.cookie("token",token,{
      httpOnly:true,
    expires:new Date(Date.now()+60*1000),
    }) ;
    res.redirect("/");
    
});
app.get("/logout",(req,res)=>{
  res.cookie("token",null,{
    httpOnly:true,
  expires:new Date(Date.now()),
  }) ;
  //res.redirect("/");
  res.render("login");
  
});
// app.get("/add",async(req, res)=>{
//    await User.create({name:"GAnpat",email:"ganpatbusiness73@gmail.com"});
//       res.send("Nice");
// });
// app.get("/success",(req, res)=>{
//    res.render("success");
// });
app.post("/login",async(req,res)=>{

  const {email,password}=req.body;
  let user=await User.findOne({email});

  if(!user) return res.redirect("/register");
   
  const ismatch = await bcrypt.compare(password, user.password);
  if(!ismatch) return res.render("login",{massage:"incorrect password"});

  
  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
    
  res.cookie("token",token,{
    httpOnly:true,
  expires:new Date(Date.now()+60*1000),
  }) ;
  res.redirect("/");

})
app.get("/login",(req, res)=>{
   res.render("login");
});

app.get("/contact",async(req,res)=>{
  console.log(req.body);
 const {name,email,password}=req.body;
  await User.create({name ,email,password});
  res.redirect("/success");
});

// app.get("/users",(req,res)=>{
//   res.json({
//     users,
//   });
// })

app.listen(5000,()=>{
  console.log("server is working i am ");
});
