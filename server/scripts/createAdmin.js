require("dotenv").config({ path: "./config/config.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log("Usage: node createAdmin.js <email> <username> [password]");
      console.log("Example: node createAdmin.js admin@example.com adminuser");
      process.exit(1);
    }

    const email = args[0];
    const username = args[1];
    const password = args[2] || "admin123"; // Default password if not provided

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Update existing user to admin
      existingUser.role = "admin";
      await existingUser.save();
      console.log(`✓ User ${email} has been updated to admin role`);
      process.exit(0);
    }

    // Create new admin user
    const admin = await User.create({
      username,
      email,
      password,
      role: "admin",
    });

    console.log("✓ Admin user created successfully!");
    console.log(`  Email: ${admin.email}`);
    console.log(`  Username: ${admin.username}`);
    console.log(`  Password: ${password}`);
    console.log("\n⚠️  Please change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();

