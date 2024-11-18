import Intern from '../models/Intern.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/emailUtils.js';
import { generateResetToken } from '../utils/tokenUtils.js';
import { sendPasswordResetEmail } from '../utils/passwordResetEmail.js';


// Intern Signup
export const signupIntern = async (req, res) => {
   const { name, email, internId, password } = req.body;

   try {
      const existingIntern = await Intern.findOne({ email });
      if (existingIntern) return res.status(400).json({ message: "Email already taken." });

      const newIntern = new Intern({ name, email, internId, password });
      await newIntern.save();

      // Create a verification token
      const token = jwt.sign({ internId: newIntern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      await sendVerificationEmail(newIntern, token);

      res.status(201).json({ message: "Signup successful! Check your email for verification." });
   } catch (error) {

      res.status(500).json({ message: "Server error: " + error.message });
   }
};

// Email Verification for Interns
export const verifyInternEmail = async (req, res) => {
   const { token } = req.query;

   try {
      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const intern = await Intern.findById(decoded.internId);

      if (intern && !intern.isVerified) {
         intern.isVerified = true;
         await intern.save();
         res.status(200).json({ message: 'Email verified successfully' });
      } else {
         res.status(400).json({ message: 'Invalid token or intern already verified' });
      }
   } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token' });
   }
};

// Intern Login
export const loginIntern = async (req, res) => {
   const { internId, password } = req.body;

   try {
      // Find intern by internId 
      const intern = await Intern.findOne({ internId });
      if (!intern) return res.status(404).json({ message: 'Intern not found' });

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, intern.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Create and sign a token with internId
      const token = jwt.sign({ internId: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token and intern details
      res.json({
         token,
         user: {
            id: intern._id,
            name: intern.name,
            email: intern.email,
            role: intern.role,
            duration: intern.duration,
            tasks: intern.tasks,
         },
      });
   } catch (error) {
      res.status(500).json({ message: 'Server error during login' });
   }
};

// Get Intern Details
export const getInternDetails = async (req, res) => {
   const internId = req.user.internId;

   try {
      // Fetch the intern's details, excluding the password
      const intern = await Intern.findById(internId).select('-password');

      if (!intern) return res.status(404).json({ message: 'Intern not found' });

      // Send the intern's details back as a response
      res.json({
         name: intern.name,
         role: intern.role,
         duration: intern.duration,
         tasks: intern.tasks,
      });
   } catch (error) {
      console.error('Error fetching intern details:', error);
      res.status(500).json({ message: 'Error fetching intern details' });
   }
};

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
   const { email } = req.body;
   console.log("Request received for password reset:", email);

   try {
      const intern = await Intern.findOne({ email });
      if (!intern) {
         console.log("Intern not found for email:", email);
         return res.status(404).json({ error: 'Intern not found' });
      }

      const resetToken = generateResetToken(intern._id);
      await sendPasswordResetEmail(intern, resetToken);

      res.status(200).json({ message: 'Password reset email sent successfully' });
   } catch (error) {
      console.error('Error during password reset process:', error);
      res.status(500).json({ error: 'Failed to send password reset email' });
   }
};

// Reset Password
export const resetPassword = async (req, res) => {
   const { token } = req.params;
   const { password } = req.body;

   if (!token) {
      return res.status(400).json({ error: 'Token is required' });
   }

   try {
      // Verify the token and extract internId from the token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if intern exists in the database
      const intern = await Intern.findById(decoded.internId);
      if (!intern) {
         return res.status(404).json({ error: 'Intern not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      await Intern.updateOne({ _id: intern._id }, { password: hashedPassword });

      res.status(200).json({ message: 'Password reset successful' });
   } catch (error) {
      console.error('Error resetting password:', error);
      res.status(400).json({ error: 'Invalid or expired token' });
   }
};


