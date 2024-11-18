import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Importing route files
import internRoutes from './routes/internRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
   origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
   methods: 'GET,POST,PUT,DELETE,OPTIONS',
   allowedHeaders: 'Content-Type,Authorization',
   credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/intern', internRoutes);
app.use('/api/admin', adminRoutes);

// Port and server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
