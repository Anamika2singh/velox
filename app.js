const express =  require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
let PORT = process.env.PORT || 3000

app.use(bodyparser.json({extended : true}));
app.use(bodyparser.urlencoded({extended : true}))


mongoose.promise =  global.promise;
mongoose.connect('mongodb+srv://annu:anamika@cluster0.fhigx.mongodb.net/velox?retryWrites=true&w=majority',
{useNewUrlParser:true ,useUnifiedTopology: true},{ useFindAndModify: false })
.then(()=>console.log('connection successful'))
.catch((err)=>console.error(err))
const userroute = require('./routes/user');
app.use('/',userroute);

app.listen(PORT)
    
 