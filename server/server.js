const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const apiRouter = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Paths
const wifePhotosPath = path.join(__dirname, '../wife');

// Create folder if it doesn't exist
if (!fs.existsSync(wifePhotosPath)) {
  fs.mkdirSync(wifePhotosPath, { recursive: true });
}

// Serve photos statically
app.use('/photos', express.static(wifePhotosPath));

// Mount central API routing aggregator
app.use('/api', apiRouter);

// Initialize MongoDB Connection (JSON fallback handled dynamically inside controllers)
db.connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
