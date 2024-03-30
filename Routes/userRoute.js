const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const verifyToken = require("../middleware/auth");
const {registervalidate,emailvalidate,productvalidate}=require("../middleware/inputvalidator");

router.post("/user/register",registervalidate(),controller.userregister);
router.post("/user/registerotp", controller.registerotp);
router.post("/user/login",emailvalidate(),controller.userlogin);


router.post("/user/additem",productvalidate(),verifyToken,controller.additemslist);
router.get("/user/getproduct",verifyToken,controller.getProduct);
router.get("/user/getproducts/:id",verifyToken,controller.getsingleproduct);
router.delete("/user/deleteproduct/:id",verifyToken,controller.deleteproducts);
router.put("/user/editproduct",productvalidate(),verifyToken,controller.editproduct);
router.put("/user/statusupdate",verifyToken,controller.statusupdate)

module.exports = router;
