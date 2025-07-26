import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

const createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName) {
            return res.status(400).json({ message: "Category name is required" });
        }
        // Make Friendly URL Slug
        const slug = categoryName.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');


        const newCategory = new Category({
            categoryName: categoryName,
            shopId: req.user.id, // Assuming req.user.id contains the shop owner's ID
            slug: slug
        });

        if (!newCategory) {
            return res.status(400).json({ message: "Invalid category data" });
        }

        await newCategory.save();

        return res.status(201).json({ message: "Category created successfully", category: newCategory });

    } catch (error) {
        return res.status(500).json({ message: "Error creating category", error });
    }
};

//This Function will get Category Data According to the Shop ID
const getCategoryData = async (req, res) => {
    try {
        const shopId = req.user.id; // Assuming req.user.id contains the shop owner's ID
        const categories = await Category.find({ shopId: shopId });
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "No categories found for this shop" });
        }
        return res.status(200).json({ message: "Categories fetched successfully", categories });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching category data", error });
    }
}

export { createCategory, getCategoryData };