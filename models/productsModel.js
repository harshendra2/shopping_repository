const mongoose = require('mongoose')
const Schema=mongoose.Schema

const productsSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status: { 
        type: String,
        required: true,
        default: "processing"
    },
    dateCreated:{
        type:Date,
        require:false
    }
    ,updatedDate: {
        type:Date,
        default:Date.now
    }

})
module.exports=mongoose.model('Products',productsSchema)