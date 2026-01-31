const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
const { protect } = require('../middleware/auth');

// Ensure your .env has these exact keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';
    
    // Determine folder based on the form field name from frontend
    let folderName = 'ghost19_misc';
    if (file.fieldname === 'resume') folderName = 'ghost19_resume';
    if (file.fieldname === 'projectImage') folderName = 'ghost19_projects';
    if (file.fieldname === 'certFile') folderName = 'ghost19_certs';

    return {
      folder: folderName,
      // 'auto' lets Cloudinary determine if it's image or raw (PDF)
      resource_type: 'auto', 
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
      // Force PDF extension if it is one, ensures correct browser behavior
      format: isPdf ? 'pdf' : undefined, 
    };
  },
});

const upload = multer({ storage });

// POST /api/upload
// Protect this route so only admins can upload
// .any() allows us to accept dynamic field names ('resume', 'projectImage', etc.)
router.post('/', protect, upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ msg: 'No file uploaded or file rejected by Cloudinary' });
  }
  // Return the secure URL of the uploaded file
  res.json({ url: req.files[0].path || req.files[0].secure_url });
});

module.exports = router;