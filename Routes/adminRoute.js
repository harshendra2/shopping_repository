const express = require("express");
const router = new express.Router();
const controller = require("../controllers/adminController");
const config = require("../config/config");
const verifyToken = require("../middleware/adminAuth");


router.post("/admin/register", controller.adminregister);
router.post("/admin/login", controller.adminLogin);
router.get("/admin/userlist",verifyToken,controller.usermanagement);
router.post("/admin/blockuser",verifyToken,controller.blockUser);
router.post("/admin/packagecategory",verifyToken,controller.packageCategory)
router.post("/admin/addpackageitem",verifyToken,controller.addPackageItem)
router.get("/admin/categorylist",verifyToken,controller.getcategory);
router.delete("/admin/deletecategory",verifyToken,controller.deletecategory)
router.get("/admin/getpackagelist",verifyToken,controller.getpackages)
router.delete("/admin/deletepackage",verifyToken,controller.deletePackage)
router.post("/admin/customeCategory",controller.addCustomCategory)
router.get("/admin/customecategory",verifyToken,controller.getcustomecategory)
router.post("/admin/addcustomeitem",verifyToken,controller.addcustomItem)
router.get("/admin/customlist",verifyToken,controller.getcustomelist)
router.post("/admin/editcustomlist",verifyToken,controller.geteditingcustomedata)
router.put("/admin/editcustomItem",verifyToken,controller.editcustomeitem)
router.post("/admin/getpackageitems",verifyToken,controller.geteditpackageitems)
router.put("/admin/Editpackage",verifyToken,controller.EditPackages)
router.delete("/admin/deleteCustomitem",verifyToken,controller.deleteCustome)
router.get("/admin/orderlist",verifyToken,controller.getallorders)
router.post("/admin/orderitemviews",verifyToken,controller.getorderpageuserdetails)
router.post("/admin/changeorderstatus",verifyToken,controller.changeOrderStatus)
router.post("/admin/getcategorypackage",verifyToken,controller.getcategorypackageforedit)
router.put("/admin/editcategorypackage",verifyToken,controller.EditcategoryPackage)
router.post("/admin/getuserdetails",verifyToken,controller.getUSerDetails)

module.exports = router;
