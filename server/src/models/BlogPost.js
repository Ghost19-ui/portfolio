import mongoose from 'mongoose';
import slugify from 'slugify';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog post title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, 'Please provide a blog post summary'],
      trim: true,
      maxlength: [500, 'Summary cannot be more than 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide blog post content'],
    },
    coverImage: {
      type: String,
      default: '/images/blog/default.jpg',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    readTime: {
      type: Number,
      default: 5, // in minutes
    },
    meta: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from title before saving
blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }

  // Set publishedAt if being published
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Text index for search
blogPostSchema.index({
  title: 'text',
  summary: 'text',
  content: 'text',
  tags: 'text',
});

// Virtual for comments (to be implemented later)
blogPostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
