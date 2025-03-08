const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static('./'));

// Log all requests to the console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Special route for the spirograph
app.get('/spirograph.html', (req, res) => {
  console.log('Serving spirograph.html');
  res.sendFile(path.join(__dirname, '/spirograph.html'));
});

// Default route handler
app.get('*', (req, res) => {
  console.log('Default route handler for:', req.url);
  // If accessing the root, send index.html
  if (req.url === '/' || req.url === '/index.html') {
    res.sendFile(path.join(__dirname, '/index.html'));
  } else {
    // For other routes that might not be caught by express.static
    res.sendFile(path.join(__dirname, req.url), (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).send('File not found');
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
  console.log(`Spirograaf is beschikbaar op http://localhost:${PORT}/spirograph.html`);
  console.log('Druk op Ctrl+C om de server te stoppen');
}); 
