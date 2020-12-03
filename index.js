const express=require("express");
const path=require("path")
const bodyparser= require('body-parser');

require("dotenv").config();
require("./database");


const app=express();

app.use(bodyparser.urlencoded({extended:true}));

app.get("/", async (req,res)=>{
    res.send("App is running")
})

///  LISITING SERVER  DONT EDIT   //
app.listen(process.env.PORT, function(req,result){
    console.log(" Server up and running:: http://localhost:3000")
})