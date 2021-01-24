const express = require("express");
const path = require("path")
const bodyparser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const expHbs = require("express-handlebars");
var moment = require('moment');
var tz = require("moment-timezone");
const helper = require("handlebars-helpers")();
const poll = require('./models/mainPoll');
const { RSA_NO_PADDING } = require("constants");

require("dotenv").config();
require("./database");


const app = express();

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: "1234asdf",
    resave: false,
    saveUninitialized: false,
    maxAge: 3600000
}
))

var hbs = expHbs.create({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layout"),
    helpers: helper,
    partialsDir: path.join(__dirname, "views/partials"),
})
app.engine("hbs", hbs.engine)
app.set('view engine', 'hbs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));
//**************************************************************Code here***************************************************** */


const checkPolled=(req,res,next)=>{
    console.log(req.session)
    console.log(req.query)
    let temp=req.session.polled;
    if (!temp){
        console.log("Session not inifialized")
        console.log("Session polled not available")
        console.log("Session initializes")
        req.session.polled=[];
    }
    else {
        temp.forEach(poll=>{
            // console.log(poll)
            if (poll===req.query.name){
                console.log("POll allready polled: redirect to show poll")
                res.redirect("/showPoll?name="+req.query.name);
            }
        })
    }
    next()
}

app.get("/", async (req, res) => {
    if (!req.session.polled){
        console.log("Session polled not available")
        console.log("Session initializes")
        req.session.polled=[];
    }
    res.render('try',{
        home:"active",
    })
});

app.get("/genPoll", async (req,res)=>{
    res.render('try_doPoll')
})

app.post('/generatePoll',async (req,res)=>{
    console.log(req.body)
    let ops=req.body.option.length;
    let val=new Array(ops);
    val.fill(0)
    let pollname=req.body.name.toString().replace(/\s/g, "_")
    console.log(val)
    let pollNew=new poll({
        name:pollname,
        topic:req.body.topic,
        option:req.body.option,
        value:val
    })
    pollNew.save()
        .then(d=>{
            console.log(pollNew)
            res.redirect("/showPoll?name="+pollname)
        })
        .catch(e=>{
            res.send(e)
        })
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
                dateGen:d.generatedOn,
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
    poll.find({name:req.query.name}, {value:1,_id:0,totalPolls:1,topic:1})
        .then(d=>{
            console.log(d)
            return res.send(d)
        })
})

// toDo polling 

app.get('/pollfor',checkPolled,(req,res)=>{
    console.log(req.query)
    poll.findOne({
        name:req.query.name
    },{topic:1,option:1,generatedOn:1,_id:1,value:1,name:1})
        .then((data)=>{
        console.log(data)
        res.render('viewPoll',{
            options:data.option,
            nameOf:data.topic,
            id:data.name
        })
    })
        .catch(error => {
            console.log("error has occured")
            res.send("error in finding poll")
        })
});



app.post('/submitOption',((req, res) => {
    let temp=req.session.polled;
    console.log(temp)
    let flag=false;
    temp.forEach(poll=>{
        // console.log(poll)
        if (poll===req.body.poll){
            console.log("POll allready polled: redirect to show poll")
            flag=true;
        }
    })
    if (flag) {
        console.log("Redirectign")
        return res.redirect("/showPoll?name=" + req.body.poll);
    }

    console.log(req.body);
    poll.findOne({name:req.body.poll},{value:1})
        .then(data=>{
            // console.log(data)
            let updatedArray=data.value;
            updatedArray[req.body.ans]++;
            console.log(updatedArray)
            poll.updateOne({name:req.body.poll},
                { $inc: {totalPolls: 1 },
                    $set:{value:updatedArray}
                }
            )
                .then(success=>{
                    req.session.polled.push(req.body.poll)       //adding poll to the session
                    console.log("Poll saved")
                    res.redirect('/showPoll?name='+req.body.poll)
                })
                .catch(e=>{
                    console.log("Error:  "+e)
                    res.send(e)
                })
        })
}))

//poll page route
app.get('/polls', (req, res) => { 
    poll.find({},{options: 0,generatedOn:0,value: 0 ,_id:0}).sort({ "totalPolls": -1 }).limit(5).lean()
        .then(ans => {
        console.log(ans);
        res.render('try_polls', {
            poll: ans,
            polling:"active"
        })
     })
})


/////latest created  -------------------------------  
app.get('/search', (req, res) => {
    // console.log("Search trig: "+req.query["term"])
    var regex = new RegExp(req.query["term"], 'i');
    var searchFilter = poll.find({$or:[{topic: regex},{name:regex}] }, { 'name': 1 }).sort({ "generatedOn": -1 }).limit(5);
    searchFilter.exec(function (err, data) {

        var result = [];
        if (!err) {
            if (data.length > 0) {
                
                data.forEach(user => {
                    let obj = {
                        name: user.name,
                        label: user.name
                    };
                    // console.log(obj);
                    
                   result.push(obj);
                //    console.log(result);  
                });
            }
            // console.log("expected output: " +JSON.stringify(result)  );
            res.jsonp(result);
        }
    });
});
// end here----------------------------

///  LISITING SERVER  DONT EDIT   //
app.listen(process.env.PORT, function (req, result) {
    console.log(" Server up and running:: http://localhost:3000")
})