const SaleImage = require("../models/SaleImage");
const cloudinary = require("../config/cloudinary");

// Upload new image
const uploadImage = async (req, res) => {
    try {
        // Ensure file buffer exists
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload file using cloudinary.uploader.upload_stream
        cloudinary.uploader.upload_stream({ folder: "SaleImages" }, async (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ message: "Cloudinary upload failed", error });
            }

            // Create and save new SaleImage
            const saleImage = new SaleImage({
                url: result.secure_url,
                public_id: result.public_id,
                order: await SaleImage.countDocuments() + 1, // Set order dynamically
            });
            await saleImage.save();

            res.status(200).json({ 
                message: "Image uploaded successfully", 
                saleImage: {
                    _id: saleImage._id,
                    url: saleImage.url,
                    order: saleImage.order
                } 
            });
        }).end(req.file.buffer);
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Failed to upload image", error });
    }
};

// Get images
const getImages = async (req, res) => {
    try {
        const images = await SaleImage.find().sort({ order: 1 }).select("-public_id"); // Exclude private field
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch images", error });
    }
};

// Delete image
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await SaleImage.findById(id);
        if (!image) return res.status(404).json({ message: "Image not found" });

        // Remove from Cloudinary
        await cloudinary.uploader.destroy(image.public_id);

        // Delete document from the database
        await SaleImage.findByIdAndDelete(id);

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete image", error });
    }
};

// Update order
const updateOrder = async (req, res) => {
    try {
        const { updates } = req.body; // [{ id: "imageId1", order: 1 }, ...]
        for (const { id, order } of updates) {
            await SaleImage.findByIdAndUpdate(id, { order });
        }
        res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order", error });
    }
};

module.exports = { uploadImage, getImages, deleteImage, updateOrder };