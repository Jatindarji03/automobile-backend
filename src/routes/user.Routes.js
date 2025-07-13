import { Router } from "express";
import { HomePage, registerUser,userLogin } from "../controllers/user.Controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/home").post(AuthMiddleware,HomePage);


export default router;// This file is currently empty, but you can add user-related routes here in the future.
// For