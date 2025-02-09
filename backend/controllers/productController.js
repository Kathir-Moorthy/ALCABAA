const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Create a new product
const createProduct = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload image to Cloudinary
        cloudinary.uploader.upload_stream({ folder: "Products" }, async (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ message: "Cloudinary upload failed", error });
            }

            // Save product details to MongoDB
            const product = new Product({
                title: req.body.title,
                category: req.body.category,
                subCategory: req.body.subCategory,
                versions: JSON.parse(req.body.versions), // Parse JSON versions from form data
                rating: req.body.rating,
                reviews: req.body.reviews,
                description: req.body.description,
                image: result.secure_url,
                imagePublicId: result.public_id,
            });

            await product.save();
            res.status(201).json({ 
                message: "Product created successfully", 
                product: {
                    _id: product._id,
                    title: product.title,
                    category: product.category,
                    subCategory: product.subCategory,
                    versions: product.versions,
                    rating: product.rating,
                    reviews: product.reviews,
                    description: product.description,
                    image: product.image
                }
            });
        }).end(req.file.buffer);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product", error });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().select("-imagePublicId"); // Exclude private field
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = { ...req.body };

        // Check if the versions field is a string, and parse it into an array
        if (updatedData.versions && typeof updatedData.versions === "string") {
            try {
                updatedData.versions = JSON.parse(updatedData.versions);
            } catch (err) {
                return res.status(400).json({ message: "Invalid versions format", error: err });
            }
        }

        // Check if a new image is uploaded
        if (req.file && req.file.buffer) {
            // Find existing product
            const product = await Product.findById(id);
            if (!product) return res.status(404).json({ message: "Product not found" });

            // Delete existing image from Cloudinary
            await cloudinary.uploader.destroy(product.imagePublicId);

            // Upload new image to Cloudinary
            const result = await new Promise((resolve, reject) =>
                cloudinary.uploader.upload_stream({ folder: "Products" }, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }).end(req.file.buffer)
            );

            // Update image details in the request body
            updatedData.image = result.secure_url;
            updatedData.imagePublicId = result.public_id;
        }

        // Update the product in MongoDB
        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true }).select("-imagePublicId");
        res.status(200).json({ 
            message: "Product updated successfully", 
            product 
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product", error });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(product.imagePublicId);

        // Delete product from MongoDB
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product", error });
    }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };