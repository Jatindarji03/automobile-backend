import { Router } from "express";
import { addMechanicToServiceCenter, getallmechanics, loginServiceCenter, registerServiceCenter, updateServiceCenter, RemoveMechanicFromServiceCenter, getServiceCenterByName, viewServiceCenterProfile, getAllServiceCenters, getNeartbyServiceCenters } from "../controllers/serviceCenter.Controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { get } from "mongoose";
const router = Router();

;
router.route("/service/mechanic").post(AuthMiddleware, addMechanicToServiceCenter);
router.route("/getmechanics").get(AuthMiddleware, getallmechanics);
router.route("/service/login").post(loginServiceCenter);
router.route("/service/register").post(registerServiceCenter);
router.route("/service/update").put(AuthMiddleware, updateServiceCenter);
router.route("/service/removeMechanic/:mechanicId").delete(AuthMiddleware, RemoveMechanicFromServiceCenter);
router.route("/service/searchServiceCenter/:serviceCenterName").get(getServiceCenterByName);
router.route("/service/getServiceCenterProfile/:serviceCenterId").get(AuthMiddleware, viewServiceCenterProfile);
router.route("/service/getServiceCenter").get(getAllServiceCenters);
router.route("/service/getNearbyServiceCenters").get(AuthMiddleware, getNeartbyServiceCenters);

export default router;