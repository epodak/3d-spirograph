/**
 * server.js - 服务器重定向文件
 * 
 * 作用：
 * 1. 作为兼容性入口点，重定向到新的服务器位置
 * 2. 保持与原有启动命令的向后兼容性
 * 
 * 被调用：
 * - 旧版npm脚本(如果直接使用根目录下的server.js)
 * 
 * 调用以下模块：
 * - src/server/server.js: 导入并执行新服务器
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve static files from the src directory
app.use('/src', express.static(path.join(__dirname, 'src')));

// Default route handler - send index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Press Ctrl+C to stop the server`);
});

// Redirect to new server location
import './src/server/server.js'; 