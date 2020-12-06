const express=require("express");
const path=require("path")
const bodyparser= require('body-parser');
const session=require('express-session');
const MemoryStore=require('memorystore')(session);
const expHbs=require("express-handlebars")
var moment = require('moment');
var tz=require("moment-timezone")
const helper=require("handlebars-helpers")();
const poll=require('./models/mainPoll');

require("dotenv").config();
require("./database");


const app=express();

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret:"1234asdf",
    resave:false,
    saveUninitialized:false,
    maxAge:3600000}
))

var hbs=expHbs.create({
    extname:"hbs",
    defaultLayout:"main",
    layoutsDir:path.join(__dirname,"views/layout"),
    helpers: helper,
    partialsDir:path.join(__dirname,"views/partials"),
})
app.engine("hbs",hbs.engine)
app.set('view engine', 'hbs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"./public")));

app.get("/", async (req,res)=>{
    res.render('dashboard')
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