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
    //tarun task
    res.render('dashboard')
})
app.get("/genPoll", async (req,res)=>{
    res.render('genPoll')
})

app.post('/generatePoll',async (req,res)=>{
    console.log(req.body)
    let ops=req.body.option.length;
    let val=new Array(ops);
    val.fill(0)
    console.log(val)
    let pollNew=new poll({
        name:req.body.name,
        topic:req.body.topic,
        option:req.body.option,
        value:val
    })
    pollNew.save()
    console.log(pollNew)
    res.json(pollNew)
})



app.get('/checkPoll',function (req,res) {
    console.log("checking poll for: "+req.query.name);
    poll.findOne({name:req.query.name})
        .then(data=>{
            console.log(data)
            if(data)
            {
                return res.send({
                    exist:false
                })
            }
            else {
                return res.send({
                    exist:true
                })
            }
        })
        .catch(e=>{
            res.send("Error checking")
        })
})
app.get("/showPoll", async (req,res)=>{
    console.log("Checking Value for poll: "+req.query.name)
    poll.findOne({name:req.query.name.toString()}, )
        .then(d=>{
            console.log(d)
            res.render('pollPage',{
                options:d.option,
                title:d.topic,
                creator:d.creator,
                date:d.generatedOn,
                value:d.value,
                name:d.name
            })
        })
        .catch(error => {
            console.log("Error")
            res.send(error)
        })

})
app.get("/getPollVal", async (req,res)=>{
    console.log("Checking Value for poll: "+req.query.name)
    poll.find({name:req.query.name}, {value:1,_id:0,totalPolls:1})
        .then(d=>{
            console.log(d)
            return res.send(d)
        })
})

///  LISITING SERVER  DONT EDIT   //
app.listen(process.env.PORT, function(req,result){
    console.log(" Server up and running:: http://localhost:3000")
})