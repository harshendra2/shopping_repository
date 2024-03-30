const mongoose = require("mongoose");
const validator = require("validator"); 
const bcrypt=require("bcryptjs");  
const jwt = require("jsonwebtoken");
const SECRET_KEY = "abcdefghijklmnop" 
const { ObjectId } = require("mongodb");

const userSchema = new mongoose.Schema({
 fname:{
    type:String,
    require:true,
    trime:true
 },
 email:{
    type:String,
    require:true,
    unique:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Not Valid Email")
        }
    }
 },
 mobile:{
    type:Number,
    require:true
 },
 password:{
    type:String,
    require:true,
    minlength:6
 }

})

//hase password
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
});

//token genrate 
userSchema.methods.generateAuthtoken= async function(){
try{

    let newtoken = jwt.sign({_id:this._id},SECRET_KEY,{
        expiresIn:"1d"
    })
    return newtoken;

}catch(error){
   return res.status(400).json(error);
}
}

//create model
const users = new mongoose.model("users",userSchema);
module.exports=users; 
