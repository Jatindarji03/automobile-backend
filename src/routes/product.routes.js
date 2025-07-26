import { Router } from "express";
import { addProduct,getProducts,deleteProduct,updateProduct} from "../controllers/product.Controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Route to add a new product
router.route('/add-product').post(AuthMiddleware,addProduct);

//Route to get products by shop
router.route('/get-products').get(AuthMiddleware, getProducts);

//Route to delete a product
router.route('/delete-product/:id').delete(AuthMiddleware,deleteProduct);

//Route to update a product
router.route('/update-product/:id').put(AuthMiddleware,updateProduct);

export default router;