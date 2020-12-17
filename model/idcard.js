const mongoose =  require('mongoose');
var Schema = mongoose.Schema
var idcard = new Schema({
    user_id : {type : mongoose.Types.ObjectId},
    name :  {type:String ,required: true},
    email :{type : String,required: true},
     phone_number : {type: Number , required : true},
     policy_number : {type : String , required : true},
     vehicles : {type : String, required : true},
    created : {type : Date , default : Date.now()},
    updated : {type :Date , default : Date.now()},
    status :  {type : Number , default : 1}
})
module.exports = new mongoose.model('idcard',idcard)