import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: { // Name of the product
        type: String,
        required: true,
    },
    productPrice: { // Price of the product
        type: Number, 
        required: true
    },
    productyQty: { // Quantity of the product
        type: Number,
        required: true,
    },
    productDescription: { // Description of the product
        type: String,
        required: true,
    },
    productImage: { // Image of the product
        type: String,
    },
    brand: { // Brand of the product
        type: String,
    },
    category: { // Category of the product
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    shop: { // Shop where the product is available
        type: mongoose.Schema.Types.ObjectId,
        ref: "HardwareShop",
        required: true,
    },

},{timestamps: true});

const Product = mongoose.model("Product", productSchema);
export default Product;