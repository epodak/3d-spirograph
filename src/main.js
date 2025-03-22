/**
 * main.js - 替代应用程序入口点(目前未使用)
 * 
 * 作用：
 * 1. 作为替代的应用入口点，与旧版架构兼容
 * 2. 初始化Engine和ControlPanel
 * 3. 目前被app.js替代，保留作为参考或未来重构使用
 * 
 * 被调用：
 * - 当前未被调用，被app.js替代
 * 
 * 调用以下模块：
 * - core/Engine.js
 * - ui/ControlPanel.js
 */

import { Engine } from './core/Engine.js';
import { ControlPanel } from './ui/ControlPanel.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('3D Spirograph应用程序启动中...');
    
    try {
        // 获取容器元素
        const container = document.getElementById('container');
        if (!container) {
            throw new Error('未找到容器元素!');
        }
        
        // 创建引擎实例
        const engine = new Engine(container);
        
        // 创建控制面板
        const controlPanel = new ControlPanel(engine);
        
        // 随机化参数以开始时呈现有趣的效果
        controlPanel.randomizeParameters();
        
        console.log('3D Spirograph应用程序成功启动!');
    } catch (error) {
        console.error('初始化3D Spirograph时出错:', error);
        alert('初始化应用程序时出错。请查看控制台以获取详细信息。');
    }
}); 
