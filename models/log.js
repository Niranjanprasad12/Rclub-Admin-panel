const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logSchema = new Schema({
    date:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    clubId:{
        type:String,
        required:true
    },
    rollNumber:{
        type:Number,
        required:true
    },
    inTime:{
        type:String,
    },
    outTime:{
        type:String
    }
},{timestamps:true})

module.exports = mongoose.model("log",logSchema);