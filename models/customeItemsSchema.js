const mongoose = require('mongoose')
const Schema=mongoose.Schema

const CustomeItemSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    img:{
        type:String,
    },
    Nonveg:{
        type:String,
        required:true
    },
    count:{
     type:String,
     required:true
    },
    foodType:{
        type:String,
        required:true
       },
     category:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'CustomeCategory',
         required:true
     }

})
module.exports=mongoose.model('customeitem',CustomeItemSchema)