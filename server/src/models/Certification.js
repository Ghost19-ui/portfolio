import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a certification title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    issuer: {
      type: String,
      required: [true, 'Please provide the issuing organization'],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, 'Please provide the issue date'],
    },
    expiryDate: {
      type: Date,
    },
    certificateUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, 'Please use a valid URL with HTTP/HTTPS'],
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, 'Please use a valid URL with HTTP/HTTPS'],
    },
    logo: {
      type: String,
      default: '/images/certifications/default.png',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for sorting and filtering
certificationSchema.index({ issueDate: -1 });
certificationSchema.index({ isFeatured: 1, displayOrder: 1 });

// Virtual property to check if certification is expired
certificationSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return this.expiryDate < new Date();
});

// Virtual property for validity period
certificationSchema.virtual('validityPeriod').get(function () {
  if (!this.expiryDate) return 'Permanent';

  const years = this.expiryDate.getFullYear() - this.issueDate.getFullYear();
  return years > 0 ? `${years} year${years > 1 ? 's' : ''}` : 'Less than a year';
});

const Certification = mongoose.model('Certification', certificationSchema);

export default Certification;
