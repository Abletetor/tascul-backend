import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
   title: {
      type: 'string',
      required: true,
      trim: true
   },
   description: {
      type: String,
      required: true,
      trim: true,
   },
   deadline: {
      type: Date,
   },
   isCompleted: {
      type: Boolean,
      default: false,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   }
});

const internSchema = new mongoose.Schema({
   internId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
   },
   name: {
      type: String,
      required: true,
      trim: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
   },
   password: {
      type: String,
      required: true,
      minlength: 6,
   },
   role: {
      type: String,
      default: 'intern',
   },
   isVerified: {
      type: Boolean,
      default: false,
   },
   duration: {
      type: String,
   },
   tasks: [taskSchema],
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

// Hash password before saving
internSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

const Intern = mongoose.model('Intern', internSchema);
export default Intern;
