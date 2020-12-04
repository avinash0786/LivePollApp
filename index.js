const express=require("express");
const path=require("path")
const bodyparser= require('body-parser');

const poll=require('./models/mainPoll');

require("dotenv").config();
require("./database");


const app=express();

app.use(bodyparser.urlencoded({extended:true}));

app.get("/", async (req,res)=>{
    res.send("App is running")
})

app.get("/addPoll", async (req,res)=>{
    let pollNew=new poll({
        topic:"First poll",
        option:{
            'A':'first option',
            'B':'second option',
            'C':'third option',
            'D':'forth option',
        },
        value:[23,12,43,54]
    })
    pollNew.save()
        .then(d=>{
            res.send("New poll generated")
        })
})

app.get("/getPoll", async (req,res)=>{

    poll.find({})
        .then(d=>{
            res.jsonp(d)
        })
})

///  LISITING SERVER  DONT EDIT   //
app.listen(process.env.PORT, function(req,result){
    console.log(" Server up and running:: http://localhost:3000")
})