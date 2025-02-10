const Profile = require("../models/Profile");

// Get profile by userId
const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error });
  }
};

// Update profile (phone and addresses)
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { phone, addresses } = req.body;
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { phone, addresses },
      { new: true, upsert: true }
    );
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

module.exports = { getProfile, updateProfile };