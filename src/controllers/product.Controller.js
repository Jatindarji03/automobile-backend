import Product from "../models/productModel.js";
// Function to add a new product
const addProduct = async (req, res) => {
    try {
        const { productName, productPrice, productyQty, productDescription, category } = req.body;

        // Validate required fields
        if (!productName || !productPrice || !productyQty || !productDescription || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //Check if product already exists by the shop and product name
        const existingProduct = await Product.findOne({}).where('shop').equals(req.user.id).where('productName').equals(productName);
        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists" });
        }

        // Create a new product
        const newProduct = new Product({
            productName: productName,
            productPrice: productPrice,
            productyQty: productyQty,
            productDescription: productDescription,
            category: category,
            shop: req.user.id
        });
        if (!newProduct) {
            return res.status(400).json({ message: "Product Creation Failed" });
        }
        await newProduct.save();
        return res.status(201).json({ message: "Product added successfully", product: newProduct });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//Function to get products by shop
const getProducts = async (req, res) => {
    try {
        const shopId = req.user.id; // Assuming the shop ID is stored in req.user.id

        const products = await Product.find({ shop: shopId })
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this shop" });
        }
        return res.status(200).json({ message: "Products retrieved successfully", products });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//Function To Deltete The Product
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        await Product.findByIdAndDelete(productId);
        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
//Function to update a product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { productName, productPrice, productyQty, productDescription, category } = req.body;
        const updateData = {};
        if(!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        if( productName) updateData.productName = productName;
        if( productPrice) updateData.productPrice = productPrice;
        if( productyQty) updateData.productyQty = productyQty;
        if( productDescription) updateData.productDescription = productDescription;
        if( category) updateData.category = category;

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};
export { addProduct, getProducts, deleteProduct, updateProduct };