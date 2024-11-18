import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Function to create an admin
const createAdmin = async () => {
   try {
      const name = 'Etornam';
      const plainPassword = 'Etornam@123';

      const existingAdmin = await Admin.findOne({ name });
      if (existingAdmin) {
         console.log('Admin with this name already exists.');
         process.exit();
      }

      // Create a new admin and save it to the database
      const newAdmin = new Admin({ name, password: plainPassword });
      await newAdmin.save();

      console.log('Admin created successfully.');
      process.exit();
   } catch (error) {
      console.error('Error creating admin:', error);
      process.exit(1);
   }
};

// Execute the function
createAdmin();
