import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: { // Name of the category
        type: String,
        required: true,
        unique: true, // Ensure category names are unique
    },
    categoryImage: { // Image of the category
        type: String,
    },
    slug: { // Slug for the category User Friendly URL
        type: String,
        unique: true, // Ensure slugs are unique
    },
    shopId: { // Reference to the shop this category belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: "HardwareShop",
        required: true,
    },
},{timestamps: true});

const Category = mongoose.model("Category", categorySchema);
export default Category;
