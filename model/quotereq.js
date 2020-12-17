const mongoose =  require('mongoose');
var Schema = mongoose.Schema
var quote = new Schema({
    user_id : {type : mongoose.Types.ObjectId},
    name :  {type:String ,required: true},
    email :{type : String,required: true},
     phone_number : {type: Number , required : true},
     address : {type : String , required : true},
     policy_number : {type : Number , required : true},
     office_email : {type : String , required : true},
    effective_date : {type : Date , required : true},
    policy_type : {type : String ,required : true},
    comment :{type : String ,required : true},
    declaration_page : {type : String , required:true},
    driving_licence : {type : String , required:true},
    created : {type : Date , default : Date.now()},
    updated : {type :Date , default : Date.now()},
    status :  {type : Number , default : 1}
})
module.exports = new mongoose.model('quote_req',quote);