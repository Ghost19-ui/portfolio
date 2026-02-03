const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
const { protect } = require('../middleware/authMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder
    let folderName = 'portfolio_misc';
    if (file.fieldname === 'resume') folderName = 'portfolio_resume';
    if (file.fieldname === 'projectImage') folderName = 'portfolio_projects';
    if (file.fieldname === 'certFile') folderName = 'portfolio_certs';

    const isPdf = file.mimetype === 'application/pdf';

    return {
      folder: folderName,
      resource_type: 'auto',
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
      format: isPdf ? 'pdf' : undefined, 
    };
  },
});

const upload = multer({ storage });

// POST /api/upload
// Accepts any field name (resume, projectImage, certFile, or just 'file')
router.post('/', protect, upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  // Return the URL of the first uploaded file
  res.json({ url: req.files[0].path });
});

module.exports = router;