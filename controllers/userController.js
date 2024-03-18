const users = require("../models/userSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = "abcdefghijklmnop" ;
const PackageCategory = require("../models/packageCategorySchema");
const PackageItem = require("../models/packageItem");
const customeitem = require("../models/customeItemsSchema");
const Order = require("../models/OrderSchema");
const { json } = require("body-parser");
const { ObjectId } = require("mongoose");

let fnamee;
let emaill;
let passwordd;
let mobilee;
let sendOtp;

//email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harsendraraj20@gmail.com",
    pass: "ukiovyhquvazeomy",
  },
});

exports.userregister = async (req, res) => {
  const { fname, email, mobile, password } = req.body;

  if (!fname || !email || !mobile || !password) {
    return res.status(400).json({ error: "Please Enter All Input Data" });
  }

  try {
    const preuser = await users.findOne({ email: email });

    if (preuser) {
      return res
        .status(400)
        .json({ error: "This user already exists in our database" });
    } else {
      fnamee = fname;
      emaill = email;
      mobilee = mobile;
      passwordd = password;

      const OTP = Math.floor(100000 + Math.random() * 900000);
      sendOtp = OTP;
      const mailOption = {
        from: "harsendraraj20@gmail.com",
        to: email,
        subject: "Sending Email For Otp signup",
        text: `OTP:- ${OTP}`,
      };

      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log("error", error);
          return res.status(400).json({ error: "Email Not Send" });
        } else {
          console.log("Email Send", info.response);
          return res.status(200).json({ message: "Email send Successfully" });
        }
      });
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid Details", error });
  }
};

exports.registerotp = async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return res.status(400).json({ error: "Please Enter Otp" });
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
      return res.status(200).json(storeData);
    } else {
      return res.status(400).json({ error: "Invalid Otp" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid Details", error });
  }
};

//user send otp
exports.userOtpSend = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please Enter Your Email and Password" });
  }

  try {
    const preuser = await users.findOne({ email: email });

    if (preuser) {
      const passwordMatch = await bcrypt.compare(password, preuser.password);
      if (passwordMatch) {
        if (!preuser.block) {
        //   const OTP = Math.floor(100000 + Math.random() * 900000);

        //   const existEmail = await userotp.findOne({ email: email });
        //   if (existEmail) {
        //     const updateDate = await userotp.findByIdAndUpdate(
        //       { _id: existEmail._id },
        //       {
        //         otp: OTP,
        //       },
        //       { new: true }
        //     );
        //     await updateDate.save();
        //     const mailOption = {
        //       from: "harsendraraj20@gmail.com",
        //       to: email,
        //       subject: "Sending Email For Otp Validation",
        //       text: `OTP:- ${OTP}`,
        //     };

        //     transporter.sendMail(mailOption, (error, info) => {
        //       if (error) {
        //         console.log("error", error);
        //         return res.status(400).json({ error: "Email Not Send" });
        //       } else {
        //         console.log("Email Send", info.response);
        //         return res
        //           .status(200)
        //           .json({ message: "Email send Successfully" });
        //       }
        //     });
        //   } else {
        //     const saveOtpData = new userotp({
        //       email,
        //       otp: OTP,
        //     });
        //     await saveOtpData.save();

        //     const mailOption = {
        //       from: "harsendraraj20@gmail.com",
        //       to: email,
        //       subject: "Sending Email For Otp Validation",
        //       text: `OTP:- ${OTP}`,
        //     };

        //     transporter.sendMail(mailOption, (error, info) => {
        //       if (error) {
        //         console.log("error", error);
        //         return res.status(400).json({ error: "Email Not Send" });
        //       } else {
        //         console.log("Email Send", info.response);
        //         return res
        //           .status(200)
        //           .json({ message: "Email send Successfully" });
        //       }
        //     });
        //   }
        // }

        const token = await preuser.generateAuthtoken();
      return res
        .status(200)
        .json({ message: "User Login Succesfully Done", userToken: token });
              
      } else {
        return res.status(400).json({ error: "Please Enter Valid Password" });
      }
    } else {
      return res
        .status(400)
        .json({ error: "This User Not Exist In our Database" });
    }
    if (preuser.block) {
      return res.status(400).json({
        error: "Your account is blocked.Please contact customer care",
      });
    }
  }
  } catch (error) {
    return res.status(400).json({ error: "Invalid Details", error });
  }
};

exports.userLogin = async (req, res) => {
  const { email, otp } = req.body;
  if (!otp || !email) {
    return res.status(400).json({ error: "Please Enter Your OTP and email" });
  }
  try {
    const otpverification = await userotp.findOne({ email: email });

    if (otpverification.otp === otp) {
      const preuser = await users.findOne({ email: email });

      // Token generation

      const token = await preuser.generateAuthtoken();
      return res
        .status(200)
        .json({ message: "User Login Succesfully Done", userToken: token });
    } else {
      return res.status(400).json({ error: "Invalid Otp " });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Invalid Details", error: error.message });
  }
};

exports.usergoogleLogin = async (req, res) => {
  const { fname, mobile, password, email } = req.body;
  if (!fname || !mobile || !password || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const preuser = await users.findOne({ email: email });
    if (preuser) {
      const passwordMatch = await bcrypt.compare(password, preuser.password);
      if (passwordMatch) {
        const token = await preuser.generateAuthtoken();

        return res
          .status(200)
          .json({ message: "User Login Successfully Done", userToken: token });
      }
    }

    // Here password hashing

    const userregister = new users({
      fname: fname,
      email: email,
      mobile: mobile,
      password: password,
    });

    const storeData = await userregister.save();
    if (storeData) {
      return res.status(200).json({ message: "User Login Successfully Done" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Invalid Details", errorMessage: error.message });
  }
};

exports.sendpasswordlink = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ status: 401, message: "Enter your Email" });
  }
  try {
    const userfind = await users.findOne({ email: email });

    //token generate for reset password

    const token = jwt.sign({ _id: userfind._id }, keysecret, {
      expiresIn: "120s",
    });

    const setusertoken = await users.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );
    if (setusertoken) {
      const mailOption = {
        from:"harsendraraj20@gmail.com",
        to: email,
        subject: "Sending Email from Password Reset",
        text: `This Link Valid For 2 MINITES https://caterninja.netlify.app/user/forgetpassword/${userfind.id}/${setusertoken.verifytoken}`,
      };

      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log("error", error);
          return res.status(400).json({ error: "Email Not Send" });
        } else {
          return res.status(201).json({ message: "Email send Successfully" });
        }
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Invalid Details", errorMessage: error.message });
  }
};

exports.forgetpasswordotp = async (req, res) => {
  const { id, token } = req.params;
  try {
    const valideuser = await users.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, keysecret);

    if (valideuser && verifyToken._id) {
      return res.status(201).json({ status: 201, valideuser });
    } else {
      return res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Invalid Details", errorMessage: error.message });
  }
};

exports.forgetpasswordtoken = async (req, res) => {
  const { id, token } = req.params;

  const { password } = req.body;
  console.log("password changeing now");
  console.log("new password", password);
  try {
    const valideuser = await users.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, keysecret);

    if (valideuser && verifyToken._id) {
      const newpass = await bcrypt.hash(password, 12);

      const setNewuser = await users.findByIdAndUpdate(
        { _id: id },
        { password: newpass }
      );

      setNewuser.save();
      return res.status(201).json({ status: 201, setNewuser });
    } else {
      return res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (error) {}
};

exports.getninjaboxpackage = async (req, res) => {
  try {
    const categoryId = "649a8dbe388ed76ea11b2bcc";

    const data = await PackageItem.find({ category: categoryId }).populate(
      "category"
    );

    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: 401, message: "User does not exist" });
  }
};

exports.getninjabuffetpackage = async (req, res) => {
  try {
    const data = await PackageItem.find({});

    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: 401, message: "User does not exist" });
  }
};

exports.getCustomeItem = async (req, res) => {
  try {
    const data = await customeitem.find({});
    if (data) {
      return res.status(200).send(data);
    } else {
      return res.status(404).json({ status: 404, message: "Data not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getpackageitems = async (req, res) => {
  const { id } = req.body;
  try {
    const data = await PackageItem.findById(id);
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getpackagecategory = async (req, res) => {
  try {
    const data = await PackageCategory.find({});
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.geuserprofiledata = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await users.findById(id);
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { country, address, city, state, postcode, phone, email, id } =
      req.body;
    if (
      !country ||
      !address ||
      !city ||
      !state ||
      !postcode ||
      !phone ||
      !email ||
      !id
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedUser = await users.findByIdAndUpdate(id, {
      $push: {
        Address: {
          country,
          address,
          city,
          state,
          postcode,
          phone,
          email,
        },
      },
    });

    if (updatedUser) {
      return res.status(200).json({ message: "Address added successfully" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getaddress = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await users.findById(id);
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteaddress = async (req, res) => {
  try {
    const { id, userId } = req.body;
    const updateResult = await users.updateOne(
      {
        _id: userId,
        "Address._id": id,
      },
      {
        $pull: {
          Address: { _id: id },
        },
      }
    );
    if (updateResult) {
      return res.status(200).json({ message: "Address Delete successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getEditAddress = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await users.findOne(
      { Address: { $elemMatch: { _id: id } } },
      { "Address.$": 1, _id: 0 }
    );
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.EditAddress = async (req, res) => {
  try {
    const { userId, country, address, city, state, postcode, phone, id } =
      req.body;
    if (
      !userId ||
      !country ||
      !address ||
      !city ||
      !state ||
      !postcode ||
      !phone ||
      !id
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updateResult = await users.updateOne(
      {
        _id: userId,
        "Address._id": id,
      },
      {
        $set: {
          "Address.$.country": country,
          "Address.$.address": address,
          "Address.$.city": city,
          "Address.$.state": state,
          "Address.$.postcode": postcode,
          "Address.$.phone": phone,
        },
      }
    );

    if (updateResult) {
      return res.status(200).json({ message: "Address edited successfully" });
    } else {
      return res
        .status(400)
        .json({ error: "Address not found or no changes made" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.OrderItem = async (req, res) => {
  try {
    const { combinedData, grandtotal, data, useDetails } = req.body;
    const result = Math.random().toString(36).substring(2, 7);
    const id = Math.floor(100000 + Math.random() * 900000);
    const orderId = result + id;

    const organiproduct = Object.values(combinedData).flatMap((array) =>
      array.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.count,
        foodType: item.foodType,
        Nonveg: item.Nonveg,
        img: item.img,
      }))
    );

    
    if (organiproduct.length === 0) {
      return res.status(400).json({ error: "No products in the order" });
    }

  
    const timeString = useDetails.times.join(', ');

    let orderData = {
      userId: data.userId,
      product: organiproduct,
      orderId: orderId,
      date: useDetails.selectedDate,
      foodType: organiproduct[0].foodType, 
      status: "processing",
      address: useDetails.orderAddress,
      time: timeString, 
      subtotal: grandtotal / 2,
      veguest: useDetails.vegguest,
      latitude: useDetails.latitude,
      longitude: useDetails.longitude,
      Nonvegguest: useDetails.Nonvegguest,
    };

    const orderPlacement = await Order.create([orderData]); 

    console.log(orderPlacement);

    if (orderPlacement) {
      return res
        .status(200)
        .json({ success: true, message: "Order placed successfully" });
    } else {
      return res.status(500).json({ error: "Failed to place the order" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addcustomepageaddress = async (req, res) => {
  try {
    const { country, address, city, state, postcode, phone, email, id } =
      req.body;
    if (
      !country ||
      !address ||
      !city ||
      !state ||
      !postcode ||
      !phone ||
      !email ||
      !id
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedUser = await users.findByIdAndUpdate(id, {
      $push: {
        Address: {
          country,
          address,
          city,
          state,
          postcode,
          phone,
          email,
        },
      },
    });

    if (updatedUser) {
      return res.status(200).json({ message: "Address added successfully" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getordereddetails = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await Order.find({ userId: id });

    // Sort the data based on the date in descending order
    data.sort((a, b) => b.date - a.date);

   

    if (data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.cancleOrder = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await Order.findById(id);
    if (data.status === "processing") {
      const setusertoken = await Order.findByIdAndUpdate(
        id,
        {
          status: "Cancle Order",
        },
        { new: true }
      );

      if (setusertoken) {
        return res.status(200).json({ message: "Status changed successfully" });
      }
    } else if (data.status === "Order Confirm") {
      const setusertoken = await Order.findByIdAndUpdate(
        id,
        {
          status: "Cancle Order",     
        },
        { new: true }
      );

      if (setusertoken) {
        return res.status(200).json({ message: "Status changed successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getviewOrder=async(req,res)=>{
  try{
    const {id}=req.body;

const data=await Order.findById(id)
if(data){
  return res.status(200).json(data);
}
  }catch(error){
    return res.status(500).json({ error: "Internal server error" });
  }
}