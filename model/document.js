const mongoose =  require('mongoose');
var Schema = mongoose.Schema
var docu = new Schema({
    user_id : {type : mongoose.Types.ObjectId},
    document :{type : String , required : true},
    created : {type : Date , default : Date.now()},
    updated : {type :Date , default : Date.now()},
    status :  {type : Number , default : 1}
})
module.exports = new mongoose.model('document',docu)