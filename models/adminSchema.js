const mongoose = require("mongoose");
const validator = require("validator"); 
const bcrypt=require("bcryptjs");  
const jwt = require("jsonwebtoken");
const SECRET_KEY = "abcdefghijklmnop" 

const adminSchema = new mongoose.Schema({
 
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
 password:{
    type:String,
    require:true,
    minlength:6
 },
 tokens:[
    {
      token:{
        type:String,
        required:true,
      }  
    }
 ]

})

//hase password
adminSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
});

//token genrate 
adminSchema.methods.generateAuthtoken= async function(){
try{

    let newtoken = jwt.sign({_id:this._id},SECRET_KEY,{
        expiresIn:"1d"
    })

    this.tokens = this.tokens.concat({token:newtoken});
    await this.save();
    return newtoken;

}catch(error){
   return res.status(400).json(error);
}
}

//create model
const admin = new mongoose.model("admin",adminSchema);
module.exports=admin; 
