import express from 'express';
import Address from '../models/Address.js';
const router = express.Router();

// Save Address
router.post("/save", async (req, res) => {
  const { name, mobileNumber, pinCode, houseAddress, locality, city, state } = req.body;

  if (!name || !mobileNumber || !pinCode || !houseAddress || !locality || !city || !state) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const address = new Address({ name, mobileNumber, pinCode, houseAddress, locality, city, state });
    await address.save();
    res.status(201).json({ message: "Address saved successfully", address });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch Address by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router; // Ensure default export
