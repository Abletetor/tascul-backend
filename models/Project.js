import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
   projectName: {
      type: String,
      required: true,
      trim: true
   },
   thumbnail: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   liveLink: {
      type: String,
      required: true
   },
   githubLink: {
      type: String,
      required: true
   },
   submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
