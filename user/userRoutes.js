const express = require("express");
const router = express.Router();
const userController = require("./userController");
 const {verifyToken} = require("../config/auth")
router.post('/create',userController.createUser)
router.post('/login',userController.login)
router.put("/toggle-status", verifyToken,userController.toggleAllUsersStatus);
router.post("/calculate", verifyToken, userController.getDistance);
router.post('/weekdays',  userController.getUsersByWeekDays);
module.exports = router;