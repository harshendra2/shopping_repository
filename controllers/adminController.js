const admin = require("../models/adminSchema");
const bcrypt = require("bcryptjs");
const users = require("../models/userSchema");
const PackageCategory = require("../models/packageCategorySchema");
const PackageItem = require("../models/packageItem");
const CustomeCategory = require("../models/CustomeCategorySchema");
const customeitem = require("../models/customeItemsSchema");
const Order = require("../models/OrderSchema");
const { OrderItem } = require("./userController");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const cloude_names = "dcgrqxvbk";
const api_keys = "241596312989648";
const api_secrets = "5ktcJh7n9t-vBuk84YSzBnQg-vs";

cloudinary.config({
  cloud_name: cloude_names,
  api_key: api_keys,
  api_secret: api_secrets,
});

//email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:"harsendraraj20@gmail.com",
    pass: "ukiovyhquvazeomy",
  },
});


exports.adminregister = async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminregister = new admin({
      email: email,
      password: password,
    });

    // Here password hashing

    const storeData = await adminregister.save();
    if (storeData) {
      return res.status(200).json({ message: "Admin register successfuly" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid Details", error });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please Enter All Input Data" });
  }
  try {
    const preAdmin = await admin.findOne({ email: email });
    if (preAdmin) {
      const passwordMatch = await bcrypt.compare(password, preAdmin.password);
      if (passwordMatch) {
        const token = await preAdmin.generateAuthtoken();
        return res
          .status(200)
          .json({ message: "User Login Succesfully Done", adminToken: token });
      } else {
        return res.status(400).json({ error: "Please check your password" });
      }
    } else {
      return res.status(400).json({ error: "Please check your email Id" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid details" });
  }
};

exports.usermanagement = async (req, res) => {
  try {
    const data = await users.find();

    return res.status(200).send(data);
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};

exports.blockUser = async (req, res) => {
  const { id, fname } = req.body;
  try {
    const block = await users.findById(id);
    if (block.block) {
      const userData = await users.findByIdAndUpdate(id, {
        $set: {
          block: false,
        },
      });
      if (userData) {
        return res.status(200).json({ message: "UnBlock successfully" });
      }
    } else {
      const userData = await users.findByIdAndUpdate(id, {
        $set: {
          block: true,
        },
      });
      if (userData) {
        return res.status(200).json({ message: "Block successfully" });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: "somthing went wrong" });
  }
};

exports.packageCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const packagecategory = new PackageCategory({
      category: category,
    });

    // Here password hashing

    const storeData = await packagecategory.save();
    if (storeData) {
      return res.status(200).json({ message: "Category Added Successfully" });
    }
  } catch (error) {
    return res.status(400).json({ error: "somthing went wrong" });
  }
};

exports.addPackageItem = async (req, res) => {
  try {
    const {
      category,
      name,
      mains,
      image,
      price,
      dessert,
      ordercount,
      starters,
    } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(image);

    // Validate the data and handle invalid data condition
    if (
      !category ||
      !name ||
      !mains ||
      !image ||
      !price ||
      !dessert ||
      !ordercount ||
      !starters
    ) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const packageItem = new PackageItem({
      name: name,
      price: price,
      desserts: dessert,
      mains: mains,
      starters: starters,
      img: uploadResponse.url,
      category: category,
      minOrder: ordercount,
    });

    const storeData = await packageItem.save();
    if (storeData) {
      return res.status(200).json({ message: "Item Added Successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getcategory = async (req, res) => {
  try {
    const data = await PackageCategory.find({});
    if (data) {
      return res.status(200).send(data);
    } else {
      return res.status(400).json({ error: "Category Not available" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid Data" });
  }
};

exports.deletecategory = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedDocument = await PackageCategory.findByIdAndDelete(id);
    if (deletedDocument) {
      return res.status(200).json({ message: "Document deleted successfully" });
    } else {
      return res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete document" });
  }
};

exports.getpackages = async (req, res) => {
  try {
    const data = await PackageItem.find({});
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(400).json({ error: "Data not available" });
  }
};

exports.deletePackage = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedDocument = await PackageItem.findByIdAndDelete(id);
    if (deletedDocument) {
      return res.status(200).json({ message: "Document deleted successfully" });
    } else {
      return res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete document" });
  }
};

exports.addCustomCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const packagecategory = new CustomeCategory({
      category: category,
    });

    const storeData = await packagecategory.save();
    if (storeData) {
      return res.status(200).json({ message: "Category Added Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Document not found" });
  }
};

exports.getcustomecategory = async (req, res) => {
  try {
    const data = await CustomeCategory.find({});
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(500).json({ error: "Document not found" });
  }
};

exports.addcustomItem = async (req, res) => {
  try {
    const { category, name, image, price, nonveg, totalcount, itemtype } =
      req.body;

    const uploadResponse = await cloudinary.uploader.upload(image);

    console.log(uploadResponse.url);

    if (
      !category ||
      !name ||
      !image ||
      !price ||
      !nonveg ||
      !totalcount ||
      !itemtype
    ) {
      return res.status(400).json({ error: "Invalid data" });
    }
    const packageItem = new customeitem({
      name: name,
      price: price,
      img: uploadResponse.url,
      Nonveg: nonveg,
      category: category,
      foodType: itemtype,
      count: totalcount,
    });

    const storeData = await packageItem.save();
    if (storeData) {
      return res.status(200).json({ message: "Item Added Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getcustomelist = async (req, res) => {
  try {
    const data = await customeitem.find({});
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.geteditingcustomedata = async (req, res) => {
  const { id } = req.body;
  try {
    const data = await customeitem.findById(id);
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editcustomeitem = async (req, res) => {
  const { id, name, price, Nonveg, count, foodType, categories, image } =
    req.body;
  try {
    let img;

    if (!image) {
      const setusertoken = await customeitem.findByIdAndUpdate(
        id,
        {
          name,
          price,
          Nonveg,
          count,
          foodType,
          category: categories,
        },
        { new: true }
      );
      if (setusertoken) {
        return res.status(200).json({ message: "Item Edited Successfully" });
      }
    } else {
      const uploadResponse = await cloudinary.uploader.upload(image);
      img = uploadResponse.url;

      const setusertoken = await customeitem.findByIdAndUpdate(
        id,
        {
          name,
          price,
          Nonveg,
          count,
          foodType,
          category: categories,
          img,
        },
        { new: true }
      );
      if (setusertoken) {
        return res.status(200).json({ message: "Item Edited Successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.geteditpackageitems = async (req, res) => {
  const { id } = req.body;
  try {
    const data = await PackageItem.findById(id);
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.EditPackages = async (req, res) => {
  const {
    id,
    name,
    price,
    starters,
    minOrder,
    mains,
    dessert,
    categories,
    image,
  } = req.body;
  try {
    let img;

    if (!image) {
      const setusertoken = await PackageItem.findByIdAndUpdate(
        id,
        {
          name,
          price,
          starters,
          minOrder,
          mains,
          dessert,
          category: categories,
        },
        { new: true }
      );
      if (setusertoken) {
        return res.status(200).json({ message: "Item Edited Successfully" });
      }
    } else {
      const uploadResponse = await cloudinary.uploader.upload(image);
      img = uploadResponse.url;

      const setusertoken = await customeitem.findByIdAndUpdate(
        id,
        {
          name,
          price,
          starters,
          minOrder,
          mains,
          dessert,
          category: categories,
          img,
        },
        { new: true }
      );
      if (setusertoken) {
        return res.status(200).json({ message: "Item Edited Successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCustome = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedDocument = await customeitem.findByIdAndDelete(id);
    if (deletedDocument) {
      return res.status(200).json({ message: "Document deleted successfully" });
    } else {
      return res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete document" });
  }
};

exports.getallorders = async (req, res) => {
  try {
    const data = await Order.find({});
    const filteredData = data.filter(
      (order) => order.status !== "Cancle Order"
    );

    filteredData.sort((a, b) => b.date - a.date);
  if (filteredData.length > 0) {
      return res.status(200).json(filteredData);
    } else {
      return res.status(404).json({ error: "Data not found" });
    }
    
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getorderpageuserdetails = async (req, res) => {
  try {
    const { id } = req.body;
    const order = await Order.findById(id);

    if (order) {
      return res.status(200).send(order);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await Order.findById(id);

const userdata= await users.findById(data.userId)


    if (data.status === "processing") {
      const setusertoken = await Order.findByIdAndUpdate(
        id,
        { status: "Order Confirm" },
        { new: true }
      );

      const mailOption = {
        from: "harsendraraj20@gmail.com",
        to:userdata.email,
        subject: "NinjaCatering your Order Confirm",
        text: `Hello ${userdata.fname} !!
        Thank you for choosing NinjaCater 
        Name : ${userdata.fname}
        Email: ${userdata.email}
        Mobile No: ${userdata.mobile} 
        Date : ${data.date}
        Time: ${data.time}  
        Veg Count : ${data.veguest}
        NonVeg Count : ${data.Nonvegguest}
        Nedd any help ${userdata.fname} : Please call us at 7736408809
        Thank you!!

        `,
      };
  
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log("error", error);
          return res.status(400).json({ error: "Email Not Send" });
        } else {
          console.log("Email Send", info.response);
        }
      })

     

      if (setusertoken) {
        return res.status(200).json({ message: "Status changed successfully" });
      }

      
      
      
      

    } else if (data.status === "Order Confirm") {
      const setusertoken = await Order.findByIdAndUpdate(
        id,
        { status: "Item Delivered" },
        { new: true }
      );

      if (setusertoken) {
        return res.status(200).json({ message: "Status changed successfully" });
      }
    }



  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getcategorypackageforedit = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await PackageCategory.findById(id);
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.EditcategoryPackage = async (req, res) => {
  try {
    const { category, id } = req.body;
    const setusertoken = await PackageCategory.findByIdAndUpdate(
      id,
      {
        category,
      },
      { new: true }
    );
    if (setusertoken) {
      return res.status(200).json({ message: "Category Edited Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUSerDetails=async(req,res)=>{
  try{
  const {id}=req.body;

  const data= await users.findById(id)
  if(data){
    return res.status(200).send(data)
  }

  }catch(error){
    return res.status(500).json({ error: "Internal Server Error" });
  }
}