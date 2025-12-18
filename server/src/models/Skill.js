import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a skill name'],
      trim: true,
      unique: true,
      maxlength: [50, 'Skill name cannot be more than 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a skill category'],
      enum: {
        values: [
          'Offensive Security',
          'Defensive Security',
          'Programming',
          'Tools',
          'Frameworks',
          'Cloud',
          'DevOps',
          'Other',
        ],
        message: 'Please select a valid category',
      },
    },
    level: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        message: 'Please select a valid skill level',
      },
      default: 'Intermediate',
    },
    icon: {
      type: String,
      default: 'code',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create compound index for category and level
skillSchema.index({ category: 1, level: 1 });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
