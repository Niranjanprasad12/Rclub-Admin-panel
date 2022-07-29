const mongoose = require('mongoose');

const Schema = mongoose.Schema;  // construction function which is used to create a schema....

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


const memberSchema = new Schema({
    name:{
        type:String,
        required:true
    },

    rollNumber:{
        type:Number,
        required:true,
        unique:true
    },

    designation:{
        default:"Member",
        type:String
    },

    campus:{
        type:String,
        default:"CEG"
    },

    department:{
        type:String,
        required:true
    },

    clubId:{
        type:String,
        uppercase:true,
        required:true,
        unique:true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    year:{
        type:Number,
        required:true
    }

}, {timestamps:true})

const MemberData = mongoose.model("MemberData",memberSchema);

module.exports = MemberData;

