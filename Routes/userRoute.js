const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const config = require("../config/config");

const verifyToken = require("../middleware/auth");

router.post("/user/register", controller.userregister);
router.post("/user/registerotp", controller.registerotp);
router.post("/user/sendotp", controller.userOtpSend);
router.post("/user/login", controller.userLogin);
router.post("/user/googlelogin", controller.usergoogleLogin);
router.post("/user/sendpasswordlink", controller.sendpasswordlink);
router.get("/user/forgetpassword/:id/:token", controller.forgetpasswordotp);
router.post("/user/:id/:token", controller.forgetpasswordtoken);
router.get("/user/ninjabox", verifyToken, controller.getninjaboxpackage);
router.get("/user/ninjabuffet", verifyToken, controller.getninjabuffetpackage);
router.get("/user/getcustomeitem", verifyToken, controller.getCustomeItem);
router.post("/user/getpackageitem", verifyToken, controller.getpackageitems);
router.get("/user/getpackagecategory",verifyToken,controller.getpackagecategory);
router.post("/user/getuserprofile", verifyToken, controller.geuserprofiledata);
router.post("/user/addadress", verifyToken, controller.addAddress);
router.post("/user/getaddress", verifyToken, controller.getaddress);
router.delete("/user/deleteaddress", verifyToken, controller.deleteaddress);
router.post("/user/getEditaddress", verifyToken, controller.getEditAddress);
router.put("/user/Editaddress", verifyToken, controller.EditAddress);
router.post("/user/orderitem", verifyToken, controller.OrderItem);
router.post("/user/addnewaddress",verifyToken,controller.addcustomepageaddress);
router.post("/user/ordereddetails", verifyToken, controller.getordereddetails);
router.post("/user/ordercancel", verifyToken, controller.cancleOrder);
router.post("/user/viewOrders",verifyToken,controller.getviewOrder)



//payment 

const stripe = require("stripe")('sk_test_51NTISASEPtzdVlqBoNXC1GmKtg6HdqgNLU3lstxmxwtujOeySH16UcZFNBC7veXbkM8bFfQekqazWDCps03IfUSR00IT1PeLfP');




router.post("/create-payment-intent", async (req, res) => {
  const { totalAmount} = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount:totalAmount*100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


module.exports = router;
