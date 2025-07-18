import { Router } from "express";
import {  addMechanicToServiceCenter, getallmechanics, loginServiceCenter, registerServiceCenter, updateServiceCenter, RemoveMechanicFromServiceCenter } from "../controllers/serviceCenter.Controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

;
router.route("/service/mechanic").post(AuthMiddleware, addMechanicToServiceCenter);
router.route("/getmechanics").get(AuthMiddleware, getallmechanics);
router.route("/service/login").post(loginServiceCenter);
router.route("/service/register").post(registerServiceCenter);
router.route("/service/update").put(AuthMiddleware, updateServiceCenter);
router.route("/service/removeMechanic/:mechanicId").delete(AuthMiddleware, RemoveMechanicFromServiceCenter);
export default router;