import Admin from '../models/Admin.js';
import Project from '../models/Project.js';
import Review from '../models/Review.js';
import Intern from '../models/Intern.js';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Admin Login 
export const loginAdmin = async (req, res) => {
   const { name, password } = req.body;

   try {
      const admin = await Admin.findOne({ name });
      if (!admin) return res.status(404).json({ message: 'Admin not found' });

      // Compare password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Generate JWT token
      const token = jwt.sign(
         { adminId: admin._id, role: 'admin' },
         process.env.JWT_SECRET,
         { expiresIn: '1d' }
      );

      // Respond with token and user details
      res.json({
         token,
         user: { role: 'admin', name: admin.name, id: admin._id }
      });
   } catch (error) {
      console.error('Error logging in admin:', error);
      res.status(500).json({ message: 'Error logging in admin' });
   }
};


// Add New Project
// Configure multer for file storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/');
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
   }
});

const upload = multer({ storage }).single('thumbnail');

export const addProject = async (req, res) => {
   // Use multer to process the file upload
   upload(req, res, async (err) => {
      if (err) {
         console.error('Error uploading file:', err);
         return res.status(500).json({ message: 'File upload error' });
      }

      // Extract other form data from req.body
      const { projectName, description, liveLink, githubLink } = req.body;
      const submittedBy = req.user._id;
      const thumbnailPath = req.file ? req.file.path : null;

      try {
         const newProject = new Project({
            projectName,
            thumbnail: thumbnailPath,
            description,
            liveLink,
            githubLink,
            submittedBy,
         });
         await newProject.save();

         res.status(201).json({ message: 'Project added successfully', project: newProject });
      } catch (error) {
         console.error('Error adding project:', error);
         res.status(500).json({ message: 'Error adding project' });
      }
   });
};


// Get All Projects
export const getAllProjects = async (req, res) => {
   try {
      const projects = await Project.find();
      res.json(projects);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching projects' });
   }
};

// Save Reviews to the database
export const submitReviews = async (req, res) => {
   try {
      const { name, email, feedback } = req.body;

      if (!name || !email || !feedback) {
         return res.status(400).json({ message: 'All fields are required.' });
      }

      const newReview = new Review({ name, email, feedback });
      await newReview.save();

      res.status(201).json({ message: 'Thank you for your feedback!' });
   } catch (error) {
      res.status(500).json({ message: 'Error submitting feedback. Please try again later.', error: error.message });
   }
};


// View Pending Reviews
export const getPendingReviews = async (req, res) => {
   try {
      const pendingReviews = await Review.find({ status: 'pending' });
      res.json(pendingReviews);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews' });
   }
};

// Approve Review
export const approveReview = async (req, res) => {
   const { reviewId } = req.params;

   try {
      const review = await Review.findById(reviewId);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      review.status = 'approved';
      await review.save();

      res.json({ message: 'Review approved successfully' });
   } catch (error) {
      res.status(500).json({ message: 'Error approving review' });
   }
};

// Get All Approve Reviews
export const getApprovedReviews = async (req, res) => {
   try {
      const approvedReviews = await Review.find({ status: 'approved' });
      res.json(approvedReviews);
   } catch (error) {
      console.error("Error fetching approved reviews:", error);
      res.status(500).json({ message: 'Error fetching approved reviews' });
   }
};


// Reject Review
export const rejectReview = async (req, res) => {
   const { reviewId } = req.params;

   try {
      const review = await Review.findById(reviewId);
      if (!review) {
         return res.status(404).json({ message: 'Review not found' });
      }

      await Review.deleteOne({ _id: reviewId });

      res.json({ message: 'Review rejected and removed' });
   } catch (error) {
      res.status(500).json({ message: 'Error rejecting review' });
   }
};


//Add Task to Intern Dashboard
export const addTask = async (req, res) => {
   const { title, description, dueDate, internId } = req.body;

   try {
      // Validate required fields
      if (!title || !description || !dueDate || !internId) {
         return res.status(400).json({ message: 'All fields are required' });
      }

      // Validate dueDate format
      const validDueDate = new Date(dueDate);
      if (isNaN(validDueDate)) {
         return res.status(400).json({ message: 'Invalid due date format' });
      }

      // Create task object
      const task = {
         title: title.trim(),
         description: description.trim(),
         deadline: validDueDate,
         isCompleted: false,
      };

      // update the intern's tasks array
      const result = await Intern.updateOne(
         { _id: internId },
         { $push: { tasks: task } }
      );

      if (result.modifiedCount === 0) {
         return res.status(404).json({ message: 'Intern not found or task not added' });
      }

      res.status(201).json({ message: 'Task added successfully' });
   } catch (error) {
      res.status(500).json({ message: 'Error adding task', error: error.message });
   }
};


// Get all interns
export const getAllInterns = async (req, res) => {
   try {
      const interns = await Intern.find();
      res.json(interns);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching interns' });
   }
};
