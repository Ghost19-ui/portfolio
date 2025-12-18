import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    githubUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, 'Please use a valid URL with HTTP/HTTPS'],
    },
    liveUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, 'Please use a valid URL with HTTP/HTTPS'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '/images/projects/default.jpg',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create text index for search functionality
projectSchema.index({
  title: 'text',
  description: 'text',
  techStack: 'text',
  tags: 'text',
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
