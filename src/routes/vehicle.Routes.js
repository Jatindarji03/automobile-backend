import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { addVehicle,getVehiclesByUser,deleteVehicle,updateVehicle } from "../controllers/vechicle.Controller.js";
const router = Router();

router.route('/addVehicle').post(AuthMiddleware,addVehicle)
router.route('/getVehiclesByUser').get(AuthMiddleware, getVehiclesByUser);
router.route('/deleteVehicle/:id').delete(AuthMiddleware,deleteVehicle);
router.route('/updateVehicle/:id').put(AuthMiddleware,updateVehicle);

export default router; // This file is currently empty, but you can add vehicle-related routes here in the future.