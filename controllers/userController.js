const users = require("../models/userSchema");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const products=require("../models/productsModel")
const { ObjectId } = require("mongoose");
const createError = require('../middleware/errorHandling');
const { validationResult } = require('express-validator');

let fnamee;
let emaill;
let passwordd;
let mobilee;
let sendOtp;

//email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:process.env.EMAILUSER,
    pass:process.env.EMAILPASSWORD,
  },
});

exports.userregister = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fname, email, mobile, password } = req.body;

  if (!fname || !email || !mobile || !password) {
    return res.status(400).json({ error: "Please Enter All Input Data" });
  }

  try {
    const preuser = await users.findOne({ email: email });

    if (preuser) {
        return next(createError(400, "This user already exists in our database"));
    } else {
      fnamee = fname;
      emaill = email;
      mobilee = mobile;
      passwordd = password;

      const OTP = Math.floor(100000 + Math.random() * 900000);
      sendOtp = OTP;
      const mailOption = {
        from:process.env.EMAILUSER,
        to: email,
        subject: "Sending Email For Otp signup",
        text: `OTP:- ${OTP}`,
      };

      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          return next(createError(400, "Email Not Send"));
        } else {
          return res.status(200).json({ message: "Email send Successfully" });
        }
      });
    }
  } catch (error) {
    next(error)
  }
};

exports.registerotp = async (req, res,next) => {
  const { otp } = req.body;
  if (!otp) {
    return next(createError(400, "Please Enter otp"));
  }
  try {
    if (otp == sendOtp) {
      const userregister = new users({
        fname: fnamee,
        email: emaill,
        mobile: mobilee,
        password: passwordd,
      });

      // Here password hashing

      const storeData = await userregister.save();
      return res.status(200).json({message:"User Signup successfully"});
    } else {
      return next(createError(400, "Invalid Otp"));
    }
  } catch (error) {
   next(error)
  }
};


exports.userlogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  try {
    const user = await users.findOne({ email });

    if (!user) {
      return next(createError(400, "This user does not exist in our database"));
    }
   

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(createError(400, "Please enter a valid password"));
    }

    const token = await user.generateAuthtoken();
    return res.status(200).json({ message: "User login successful", userToken: token });
  } catch (error) {
    next(error);
  }
};



exports.additemslist = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return next(createError(400, "Please Enter All Input Data"));
    }

    const existingProduct = await products.findOne({ title });
    if (existingProduct) {
      return next(createError(400, "Product already exists"));
    }

    const newProduct = new products({
      title,
      description,
      dateCreated:new Date() 
    });

    const savedProduct = await newProduct.save();
    if (savedProduct) {
      return res.status(200).json({ message: "Product Added Successfully" });
    } else {
      return next(createError(400, "Something went wrong"));
    }
  } catch (error) {
    next(error);
  }
}


exports.getProduct=async(req,res,next)=>{
  try{

    let data=await products.find({});
    if(data){
      return res.status(200).json(data);
    }

  }catch(error){
    next(error);
  }
}

exports.getsingleproduct = async (req, res, next) => {
  const { id } = req.params; 

  try {
    const product = await products.findById(id);
    if (product) {
      return res.status(200).json(product);
    } else {
      return next(createError(404, "This product does not exist in our database"));
    }
  } catch (error) {
    next(error);
  }
}

exports.deleteproducts=async(req,res,next)=>{
  const {id}=req.params;
try{

  const deletedDocument = await products.findByIdAndDelete(id);
    if (deletedDocument) {
      return res.status(200).json({ message: "Product deleted successfully" });
    } else {
      return next(createError(404, "Document not found"));
    }

}catch(error){
  next(error);
}
}



exports.editproduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, id } = req.body;
  try {
    let data = await products.findById(id);
    if (!data) {
      return next(createError(404, "Product not found"));
    }


    const updation = {
      title,
      description,
      updatedDate: new Date() 
    };

    const updatedProduct = await products.findByIdAndUpdate(id, updation, { new: true });
    if (updatedProduct) {
      return res.status(200).json({ message: "Product Updated Successfully", updatedProduct });
    } else {
      return next(createError(404, "No changes were made"));
    }
  } catch (error) {
    next(error);
  }
}


exports.statusupdate=async(req,res,next)=>{
  const {id}=req.body;
  try{
    if(!id){
      return next(createError(404, "Please provide product ID"));
    }
    const Data = await products.findOne({ _id:id});
    if(!Data){
      return next(createError(404, "Product not found"));
    }
    if (Data.status === "processing") {
      const delivery = await products.findOneAndUpdate(
        { _id:id},
        {
          $set: {
            status: "Shipped",
            updatedDate: new Date() 
          },
        }
      );
    } else if (Data.status === "Shipped") {
      const delivery = await products.findOneAndUpdate(
        { _id:id},
        {
          $set: {
            status: "Out of Delivery",
            updatedDate: new Date() 
          },
        }
      );
    } else if (Data.status === "Out of Delivery") {
      const delivery = await products.findOneAndUpdate(
        { _id:id},
        {
          $set: {
            status: "Delivered",
            updatedDate: new Date() 
          },
        }
      );
    }

    return res.status(200).json({message:"Status updated successfully"});

  }catch(error){
    next(error);
  }
}