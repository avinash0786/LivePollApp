const mongoose=require("mongoose");

const poll=mongoose.Schema({
    creator:{
        type:String,
        required:true,
        trim:true,
        default:"Anonymous"
    },
    generatedOn:{
        type:Date,
        default: Date.now(),
    },
    name:{
        type:String,
        unique:true,
        required:true,
        trim: true
    },
    topic:{
        type:String,
        required:true,
        trim: true
    },
    totalPolls:{
        type: Number,
        min:0,
        default:0
    },
    option:{
        type:Array,
        required:true
    },
    value:{
        type:Array,
        required:true
    }
},
    { collection: 'livePoll'}
    )
mongoose.model('poll',poll);
module.exports=mongoose.model("poll")