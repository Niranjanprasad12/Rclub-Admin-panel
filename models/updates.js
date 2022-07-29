const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const updateSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    activity:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
},{timestamps:true})


const Updates = mongoose.model("update",updateSchema);

module.exports = Updates;
