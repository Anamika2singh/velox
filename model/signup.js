const mongoose =  require('mongoose');
var Schema = mongoose.Schema
var register = new Schema({
    name :  {type:String ,required: true},
    email :{type : String,required: true},
    password : {type : String,required: true},
    created : {type : Date , default : Date.now()},
    updated : {type :Date , default : Date.now()},
    status :  {type : Number , default : 1}
})
module.exports = new mongoose.model('signup',register)