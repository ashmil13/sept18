const fs = require('fs');
const path = require('path');

// Dynamically allow loading dependencies from the server node_modules directory
module.paths.push(path.join(__dirname, 'server/node_modules'));

// Simple manual .env parser to avoid dependency issues when run from root
function loadEnv() {
  const envPath = path.join(__dirname, 'server/.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.substring(1, value.length - 1);
        }
        if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    }
  }
}
loadEnv();

let cloudinary;
let mongoose;
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  try {
    cloudinary = require('cloudinary').v2;
    mongoose = require('mongoose');
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('Cloudinary configuration loaded for setup-photos.');
  } catch (err) {
    console.error('Failed to load cloudinary or mongoose modules. Please make sure npm packages are installed in server/ directory.', err.message);
  }
} else {
  console.log('Cloudinary not configured. setup-photos will run in local-only copy mode.');
}

const SOURCE_DIRS = ['Album 1', 'Instagram', 'WhatsApp'];
const TARGET_DIR = 'wife';
const localDataPath = path.join(__dirname, 'server/data');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];

async function savePhotoReference(url, publicId, originalName) {
  // If MONGO_URI is set, try to save to MongoDB
  if (process.env.MONGO_URI) {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
      }
      
      let Photo;
      try {
        Photo = mongoose.model('Photo');
      } catch (e) {
        const PhotoSchema = new mongoose.Schema({
          url: { type: String, required: true },
          public_id: { type: String },
          originalName: { type: String },
          createdAt: { type: Date, default: Date.now }
        });
        Photo = mongoose.model('Photo', PhotoSchema);
      }
      
      const existing = await Photo.findOne({ originalName });
      if (existing) {
        console.log(`[Mongo] Photo ${originalName} already saved. URL: ${existing.url}`);
        return existing.url;
      }
      
      const newPhoto = new Photo({ url, public_id: publicId, originalName });
      await newPhoto.save();
      console.log(`[Mongo] Saved reference for ${originalName}`);
      return url;
    } catch (err) {
      console.error('[Mongo] Error saving photo reference, falling back to local JSON:', err.message);
    }
  }
  
  // Local JSON fallback
  if (!fs.existsSync(localDataPath)) {
    fs.mkdirSync(localDataPath, { recursive: true });
  }
  const photosJsonPath = path.join(localDataPath, 'photos.json');
  let localPhotos = [];
  if (fs.existsSync(photosJsonPath)) {
    try {
      localPhotos = JSON.parse(fs.readFileSync(photosJsonPath, 'utf8'));
    } catch (e) {
      localPhotos = [];
    }
  }
  
  const existing = localPhotos.find(p => p.originalName === originalName);
  if (existing) {
    console.log(`[Local JSON] Photo ${originalName} already saved. URL: ${existing.url}`);
    return existing.url;
  }
  
  localPhotos.push({
    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
    url,
    public_id: publicId,
    originalName,
    createdAt: new Date().toISOString()
  });
  
  fs.writeFileSync(photosJsonPath, JSON.stringify(localPhotos, null, 2), 'utf8');
  console.log(`[Local JSON] Saved reference for ${originalName}`);
  return url;
}

async function setupPhotos() {
  const rootDir = __dirname;
  const targetPath = path.join(rootDir, TARGET_DIR);

  console.log(`Creating target directory: ${targetPath}`);
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  let copiedCount = 0;
  let uploadedCount = 0;

  for (const dirName of SOURCE_DIRS) {
    // Check root and client folder locations
    let sourcePath = path.join(rootDir, dirName);
    if (!fs.existsSync(sourcePath)) {
      sourcePath = path.join(rootDir, 'client', dirName);
    }
    if (!fs.existsSync(sourcePath)) {
      console.log(`Source directory does not exist: ${dirName}. Skipping.`);
      continue;
    }

    console.log(`Reading from: ${sourcePath}`);
    const files = fs.readdirSync(sourcePath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const fileSourcePath = path.join(sourcePath, file);
        const cleanName = `${dirName.replace(/\s+/g, '_')}_${file}`;
        const fileTargetPath = path.join(targetPath, cleanName);

        // Always copy locally as a local cache/fallback
        try {
          if (!fs.existsSync(fileTargetPath)) {
            fs.copyFileSync(fileSourcePath, fileTargetPath);
            console.log(`Copied ${file} -> ${cleanName} locally.`);
          }
          copiedCount++;
        } catch (err) {
          console.error(`Error copying file ${file} locally:`, err);
        }

        // Upload to cloud if Cloudinary is configured
        if (isCloudinaryConfigured && cloudinary) {
          try {
            const originalName = cleanName;
            let alreadyUploaded = false;
            
            // Check in local JSON database
            const photosJsonPath = path.join(localDataPath, 'photos.json');
            if (fs.existsSync(photosJsonPath)) {
              try {
                const localPhotos = JSON.parse(fs.readFileSync(photosJsonPath, 'utf8'));
                if (localPhotos.some(p => p.originalName === originalName)) {
                  alreadyUploaded = true;
                }
              } catch (e) {}
            }
            
            // Check MongoDB if connected
            if (!alreadyUploaded && process.env.MONGO_URI && mongoose) {
              try {
                if (mongoose.connection.readyState === 0) {
                  await mongoose.connect(process.env.MONGO_URI);
                }
                const Photo = mongoose.model('Photo');
                const existing = await Photo.findOne({ originalName });
                if (existing) {
                  alreadyUploaded = true;
                }
              } catch (err) {}
            }

            if (alreadyUploaded) {
              console.log(`Photo ${cleanName} already present in cloud database. Skipping upload.`);
              uploadedCount++;
              continue;
            }

            console.log(`Uploading ${cleanName} to Cloudinary...`);
            const uploadResult = await cloudinary.uploader.upload(fileSourcePath, {
              folder: 'ayshu_birthday',
              resource_type: 'image',
              public_id: cleanName.replace(/\.[^/.]+$/, "") // strip extension for public_id
            });

            await savePhotoReference(uploadResult.secure_url, uploadResult.public_id, originalName);
            console.log(`Uploaded ${cleanName} successfully: ${uploadResult.secure_url}`);
            uploadedCount++;
          } catch (err) {
            console.error(`Error uploading ${file} to Cloudinary:`, err);
          }
        }
      }
    }
  }

  if (mongoose && mongoose.connection && mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }

  console.log(`Finished processing photos.`);
  console.log(`Total local images copied/present: ${copiedCount}`);
  if (isCloudinaryConfigured) {
    console.log(`Total cloud images uploaded/present: ${uploadedCount}`);
  }
}

setupPhotos().catch(err => {
  console.error('Error running setupPhotos script:', err);
});
