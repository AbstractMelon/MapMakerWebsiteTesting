const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch list of image filenames
app.get('/images', (req, res) => {
  const imagesDir = path.join(__dirname, 'public', 'images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const imageFilenames = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
    res.json(imageFilenames);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
