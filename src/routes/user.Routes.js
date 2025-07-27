import { Router } from "express";
import {  Profile, registerUser,userLogin,updateUserProfile ,updatePassword,getallusers} from "../controllers/user.Controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/Profile").get(AuthMiddleware,Profile);
router.route("/getallusers").get(getallusers); // Assuming you want to use the same middleware for getting all users
router.route("/updateProfile").put(AuthMiddleware, updateUserProfile);
router.route("/updatePassword").put(AuthMiddleware, updatePassword); // Assuming you want to use the same middleware for password update
export default router;// This file is currently empty, but you can add user-related routes here in the future.
// For