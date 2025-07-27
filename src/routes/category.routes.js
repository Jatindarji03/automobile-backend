import { Router } from "express";
import { createCategory , getCategoryData} from "../controllers/category.Controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.route("/create").post(AuthMiddleware, createCategory);
router.route("/getCategoryData").get(AuthMiddleware, getCategoryData);

export default router;