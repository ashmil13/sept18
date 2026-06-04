const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const Photo = require('../models/Photo');
const db = require('../config/db');
const localDb = require('../utils/localDb');

const wifePhotosPath = path.join(__dirname, '../../wife');

// Create folder if it doesn't exist
if (!fs.existsSync(wifePhotosPath)) {
  fs.mkdirSync(wifePhotosPath, { recursive: true });
}

// Setup Cloudinary config if credentials exist
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary configured successfully for photo uploads.');
} else {
  console.warn('Cloudinary environment variables missing. Falling back to local file storage for uploads.');
}

// GET /api/photos
exports.getPhotos = async (req, res) => {
  if (isCloudinaryConfigured) {
    try {
      let photos = [];
      if (db.isConnected()) {
        const dbPhotos = await Photo.find().sort({ createdAt: 1 });
        photos = dbPhotos.map(p => p.url);
      } else {
        const localPhotos = localDb.read('photos');
        photos = localPhotos.map(p => p.url);
      }

      // If we have photos in the database, return them
      if (photos.length > 0) {
        return res.json(photos);
      }
      
      console.log('Cloud database photo list is empty. Falling back to local folder files.');
    } catch (err) {
      console.error('Error fetching photos from cloud database:', err);
    }
  }

  // Local fallback: Scan wife directory
  fs.readdir(wifePhotosPath, (err, files) => {
    if (err) {
      console.error('Error reading wife photos directory:', err);
      return res.status(500).json({ error: 'Unable to scan photos directory' });
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
    const photos = files
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map(file => `/photos/${file}`);

    res.json(photos);
  });
};

// POST /api/photos/upload
exports.uploadPhoto = async (req, res) => {
  const { fileName, fileData } = req.body;
  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'fileName and fileData (base64) are required' });
  }

  if (isCloudinaryConfigured) {
    try {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(fileData, {
        folder: 'ayshu_birthday',
        resource_type: 'image'
      });

      const newPhotoUrl = uploadResult.secure_url;
      const publicId = uploadResult.public_id;

      if (db.isConnected()) {
        const newPhoto = new Photo({
          url: newPhotoUrl,
          public_id: publicId,
          originalName: fileName
        });
        await newPhoto.save();
      } else {
        const localPhotos = localDb.read('photos');
        localPhotos.push({
          id: Date.now().toString(),
          url: newPhotoUrl,
          public_id: publicId,
          originalName: fileName,
          createdAt: new Date().toISOString()
        });
        localDb.write('photos', localPhotos);
      }

      console.log(`Successfully uploaded photo to Cloudinary: ${newPhotoUrl}`);
      return res.status(201).json({ url: newPhotoUrl });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
    }
  }

  // Fallback / Local saving logic
  try {
    // Remove base64 data prefix if present (e.g. data:image/png;base64,)
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    const safeFileName = Date.now() + '_' + fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(wifePhotosPath, safeFileName);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error('Error saving uploaded photo locally:', err);
        return res.status(500).json({ error: 'Failed to save photo to disk' });
      }
      const newPhotoUrl = `/photos/${safeFileName}`;
      res.status(201).json({ url: newPhotoUrl });
    });
  } catch (err) {
    console.error('Local upload handler error:', err);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
};
