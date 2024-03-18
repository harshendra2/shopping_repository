const mongoose = require("mongoose");

const CustomeCategorys= new mongoose.Schema({
 
 category:{
    type:String,
    require:true,
 }
})

//create model
const CustomeCategory = new mongoose.model("CustomeCategory",CustomeCategorys);
module.exports=CustomeCategory; 