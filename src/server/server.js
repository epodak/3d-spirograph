/**
 * server.js
 * Simple Express server for local development
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the root directory
app.use(express.static(rootDir));

// Serve static files from the src directory
app.use('/src', express.static(path.join(rootDir, 'src')));

// Serve public files
app.use('/public', express.static(path.join(rootDir, 'src', 'public')));

// Default route handler - serve the index.html from public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'public', 'index.html'));
});

// Default route handler for other routes - fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Press Ctrl+C to stop the server`);
}); 