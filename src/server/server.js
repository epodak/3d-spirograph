/**
 * server.js - Express开发服务器
 * 
 * 作用：
 * 1. 创建HTTP服务器提供项目文件
 * 2. 配置静态资源路径和路由
 * 3. 处理请求并返回适当的文件
 * 
 * 被调用：
 * - package.json: 通过npm run dev或npm start执行
 * 
 * 调用以下模块：
 * 标准Node.js模块: express, path, url
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 从根目录提供静态文件
app.use(express.static(rootDir));

// 从src目录提供静态文件
app.use('/src', express.static(path.join(rootDir, 'src')));

// 提供public文件
app.use('/public', express.static(path.join(rootDir, 'src', 'public')));

// 默认路由处理器 - 从public目录提供index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'public', 'index.html'));
});

// 其他路由的默认处理器 - 回退到index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir, 'src', 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}/`);
    console.log(`按 Ctrl+C 停止服务器`);
});
