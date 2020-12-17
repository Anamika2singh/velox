const express =  require('express');
var router =  express.Router();
const bcrypt =  require('bcrypt');
const saltRounds = 10;
const { Validator } = require('node-input-validator');
const jwt =  require('jsonwebtoken')
const register = require('../model/signup');
const req_idcard = require('../model/idcard');
const upload_documents = require('../model/document');
const quote_req = require('../model/quotereq');
const multer =  require('multer');
router.post('/signup',(req,res,next)=>{
  console.log(req.body);
  const v = new Validator(req.body,{
   name : 'required|maxLength:20',
   email : 'required|email',
   password : 'required'
  })
  v.check().then((matched)=>{
    if (!matched) {
        res.status(422).send(v.errors);
      }
      else{
        register.findOne({'email' : req.body.email},(err,result)=>{
            if(result == null){
                register.create({
                    name : req.body.name,
                    email : req.body.email,
                    password  : bcrypt.hashSync(req.body.password,saltRounds),
                }).then(user=>{res.status(200).json({"statusCode" : "200",'message': "registered succesfully",result : user})})
    .catch(err=>{res.status(500).json({statusCode:500,message:"internal server error",error : err.message})})
            }
            else{
                res.status(400).json({"statusCode" : "400",'message' : 'this mail already registered'});
            }
        })
      }
  })
})
router.post('/login',(req,res,next)=>{
    console.log(req.body);
    const v =  new Validator(req.body,{
        email : 'required|email',
      password : 'required'
    })
    v.check().then((matched)=>{
        if(!matched){
            res.status(422).send(v.errors);
        }
        else{
            register.findOne({'email' : req.body.email},(err,result)=>{
                if(result == null){
                    res.status(400).json({"statusCode" : "400",'message' : "this mail not registered"})
                }
                else{
                    bcrypt.compare(req.body.password , result.password,(err,user)=>{
                        if(user ==  true){
                            let token = jwt.sign(result.toJSON(),'LOGKEY');
                            let check = result.toJSON();
                             check.token = token
                            console.log(token)
                            res.status(200).json({"statusCode" : "200",message : "login succesfully",result : check})
                        }
                        else{
                            res.status(400).json({"statusCode" : "400",message: "password not matched"})
                        }
                    })
                }
            })
        }
    })
   
})
router.post('/forgetpass',(req,res,next)=>{
 console.log(req.body)
 const v =  new Validator(req.body,{
    email : 'required|email'
})
v.check().then((matched)=>{
    if(!matched){
        res.status(422).send(v.errors);
    }
    else{
 register.findOne({'email' : req.body.email},(err,result)=>{
   if(result == null)
   res.status(400).json({statusCode : 400,'message' : "not a valid mail"})
   else
   res.status(200).json({statusCode : 200,'message' : "mail verified",result : result})
 })
}
})
})
router.post('/create_passowrd',(req,res,next)=>{
    const v =  new Validator(req.body,{
        user_id : 'required',
        new_password : 'required'
    })
    v.check().then((matched)=>{
        if(!matched){
      res.status(422).json({statusCode : 422,  err : v.errors})
        }
        else{
   
            register.findOne({'_id':req.body.user_id},(err,data)=>{
                if(data == null){
                res.status(400).json({statusCode :400,'message' :"register first"})
                }
                else 
                {
                    register.updateOne({'email' : data.email}, 
                    { $set:{password: bcrypt.hashSync(req.body.new_password,saltRounds)}},(err, updatepas)=>{
                        if(updatepas ==  null){
        res.status(500).json({statusCode:500, message : "internal server error",errors : err.message})
                        }
                        else{
                            res.status(200).json({statusCode : 200,message : "password changed"})
                        }
                    })
                }
            })
        }
    })
  
})
router.post('/request_idcard',(req,res,next)=>{
    console.log(req.body);
    const v =  new Validator(req.body,{
        user_id : 'required',
        name :'required',
        email : 'required|email',
         phone_number : 'required',
         policy_number :'required',
         vehicles : 'required',
    })
    v.check().then((matched)=>{
        if(!matched){
            res.status(422).json({statusCode:422,error : v.errors});
        }
        else{
            req_idcard.findOne({'user_id' : req.body.user_id},(err,final)=>{
                if(final == null)
                {
                    req_idcard.create({
                        user_id : req.body.user_id,
                        name : req.body.name,
                        email :req.body.email,
                         phone_number : req.body.phone_number,
                         policy_number :req.body.policy_number,
                         vehicles : req.body.vehicles
                    }).then(user=>{res.status(200).json({statusCode : 200,'message':"added idcard",data : user})})
            .catch(err=>{res.status(500).json({statusCode:500,message:"internal server error",error : err.message})})
                }
                else{
                res.status(400).json({statusCode: 400,message : "this user already request for the idcard"})
                }
            })
        }
    })
})

var storage =  multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./upload');
    }, 
    filename : function(req,file,cb){
        cb(null,  Date.now()+file.originalname )
    }
}) 
const upload = multer({
    storage :storage
})
router.use('/picture',express.static('upload'))
var cpUpload = upload.fields([{ name: 'declaration_page', maxCount: 1 }, { name: 'driving_licence', maxCount: 1 }])
router.post('/quote_req',cpUpload,(req,res,next)=>{
//     let pic_arr = [];
// req.files.forEach(element => {
//     pic_arr.push(`http://localhost:3000/picture/${element.filename}`)
// });
// console.log(pic_arr)
// console.log(req.files['declaration_page'][0].filename)
//  res.json({
//      profile_url : `http://localhost:3000/picture/${req.file.filename}`
//  })
const v =  new Validator(req.body,{
    user_id :'required' ,
    name : 'required',
    email :'required|email',
     phone_number : 'required',
     address : 'required',
     policy_number :'required' ,
     office_email : 'required|email',
    effective_date : 'required',
    policy_type :'required',
    comment :'required',
})
v.check().then((matched)=>{
    if(!matched){
    res.status(422).json({statusCode:422,err : v.errors})
    }
    else{
        quote_req.findOne({'user_id':req.body.user_id},(err,data)=>{
            if(data == null){
                quote_req.create({
                    user_id : req.body.user_id,
                name : req.body.name,
                email :req.body.email,
                 phone_number : req.body.phone_number,
                 address : req.body.address,
                 policy_number : req.body.policy_number,
                 office_email : req.body.office_email,
                effective_date : req.body.effective_date,
                policy_type : req.body.policy_type,
                comment :req.body.comment,
                declaration_page : `${req.files['declaration_page'][0].filename}`,
                driving_licence :  `${req.files['driving_licence'][0].filename}`
                }).then(user=>{res.status(200).json({statusCode : 200,message : "added quote request",result : user})})
                .catch(err=>{res.status(500).json({statusCode:500,error : err.message})})
            }
            else{
     res.status(400).json({statusCode: 400,message : "this user already quote resuested"})           
            }
        })
       
    }
})
})
router.post('/documents',upload.single('document'),(req,res,next)=>{
console.log(req.files);
// let doc_arr=[];
// req.files.forEach(element=>{
//     doc_arr.push(`http://localhost:3000/picture/${element.filename}`)
// })
// console.log(doc_arr)
const v = new Validator(req.body,{
    user_id : 'required'
})
v.check().then((matched)=>{
    if(!matched){
 res.status(422).json({statusCode:422,error : v.errors})
    }
    else{
        upload_documents.create({
            user_id : req.body.user_id,
            document :req.file.filename
               })
.then(user=>{res.status(200).json({statusCode:200,message:"added document",result : user})})
.catch(err=>{res.status(500).json({statusCode:500,message:"internal server error",error : err.message})})
    }
})
})
router.post('/docu_lib',(req,res,next)=>{
    console.log(req.body)
    const v = new Validator(req.body,{
        user_id : 'required'
    })
   
    v.check().then((matched)=>{
        if(!matched){
            res.status(422).json({error : v.errors})
        }
        else{
            upload_documents.find({'user_id' : req.body.user_id},(err,user)=>{
                if(user ==  null){
                    res.status(400).json({'message' : "first upload documents"})
                }
                else{
                    let doc_arr = [];
                    user.forEach(element => {
                        // console.log(element.document);
                        doc_arr.push(element.document);
                    })
                    res.status(200).json({statusCode:200,documents : doc_arr})
                    console.log(doc_arr);
                }
            })
        }
    })
  
})
router.post('/edit_idcard',(req,res,next)=>{
    const v = new Validator(req.body ,{
        id_card : 'required',
        name : 'required',
        email :'required|email',
         phone_number : 'required|integer',
         policy_number :'required|integer',
         vehicles : 'required',
         user_id :'required'
      })
      v.check().then((matched)=>{
        if(!matched){
        res.status(422).send(v.errors)
        }
        else{
            req_idcard.findByIdAndUpdate({'_id' : req.body.id_card},{
                name : req.body.name,
                email :req.body.email,
                 phone_number : req.body.phone_number,
                 policy_number :req.body.policy_number,
                 vehicles : req.body.vehicles,
                 user_id : req.body.user_id
    },(err,user)=>{
        if(user == null)
        res.status(400).json({statusCode:400,message : "this user id not req for idcard"})
        else
        res.status(200).json({message:"updated",result : user})
    })
        }
    })
})
module.exports =  router;