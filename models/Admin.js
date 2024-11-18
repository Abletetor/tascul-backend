import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   password: {
      type: String,
      required: true,
      minlength: 6
   },
   role: {
      type: String,
      default: 'admin'
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
