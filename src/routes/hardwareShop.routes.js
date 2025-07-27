import { Router } from "express";
import {registerHardwareShop,login,updateHardwareShopProfile,getHardwareShopProfile} from "../controllers/hardwareShop.Controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.route("/register").post(registerHardwareShop);
router.route('/login').post(login);
router.route('/updateProfile/:id').put(AuthMiddleware, updateHardwareShopProfile);
router.route('/profile/:id').get(AuthMiddleware,getHardwareShopProfile);

export default router;