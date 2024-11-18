import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   feedback: {
      type: String,
      required: true
   },
   status: {
      type: String,
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending'
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
