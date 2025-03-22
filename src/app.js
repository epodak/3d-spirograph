/**
 * app.js - 3D螺旋图应用程序入口点
 * 
 * 作用：
 * 1. 初始化并协调整个应用程序的各个模块
 * 2. 管理应用程序的生命周期
 * 3. 创建并启动渲染循环
 * 
 * 被调用：index.html中通过<script type="module" src="src/app.js"></script>直接加载
 * 
 * 调用以下模块：
 * - render/Scene.js: 创建并管理3D场景
 * - render/Renderer.js: 处理WebGL渲染
 * - spirograph/SpirographController.js: 控制螺旋图的生成和动画
 * - ui/UIPanel.js: 创建用户界面控制面板
 * - utils/ThreeLoader.js: 确保THREE.js库正确加载
 */
import { SceneManager } from './render/Scene.js';
import { RendererManager } from './render/Renderer.js';
import SpirographController from './spirograph/SpirographController.js';
import UIPanel from './ui/UIPanel.js';
import { waitForThree } from './utils/ThreeLoader.js';

console.log('App.js loaded!');

class App {
    constructor() {
        // 初始化类的属性
        this.scene = null;
        this.renderer = null;
        this.spirographController = null;
        this.uiPanel = null;
        console.log('App constructor called');
    }

    /**
     * Initialize the application
     * 初始化应用程序
     */
    async init() {
        try {
            console.log('Initializing application...');
            
            // 确保THREE.js已加载
            console.log('Waiting for THREE...');
            const THREE = await waitForThree();
            if (!THREE) {
                console.error('Failed to load THREE.js');
                return;
            }
            console.log('THREE.js loaded successfully', THREE);
            
            // 创建应用程序容器
            const appContainer = document.getElementById('app-container');
            if (!appContainer) {
                console.error('App container not found!');
                return;
            }
            console.log('App container found', appContainer);
            
            // 初始化场景
            console.log('Initializing scene...');
            this.scene = new SceneManager();
            await this.scene.init();
            console.log('Scene initialized', this.scene);
            
            // 初始化渲染器
            console.log('Initializing renderer...');
            this.renderer = new RendererManager(this.scene, appContainer);
            await this.renderer.initRenderer();
            console.log('Renderer initialized', this.renderer);
            
            // 初始化螺旋图控制器
            console.log('Initializing spirograph controller...');
            this.spirographController = new SpirographController(this.scene, this.renderer);
            await this.spirographController.init();
            console.log('Spirograph controller initialized', this.spirographController);
            
            // 初始化UI面板
            console.log('Initializing UI panel...');
            this.uiPanel = new UIPanel(this.spirographController);
            this.uiPanel.init();
            console.log('UI panel initialized', this.uiPanel);
            
            // 设置渲染循环
            console.log('Starting render loop...');
            this.startRenderLoop();
            
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }
    
    /**
     * Start the render loop
     * 开始渲染循环
     */
    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // 更新场景
            if (this.scene) {
                this.scene.update();
            }
            
            // 渲染场景
            if (this.renderer) {
                this.renderer.render();
            }
        };
        
        animate();
        console.log('Render loop started');
    }

    /**
     * Clean up resources when application is destroyed
     * 当应用程序被销毁时清理资源
     */
    dispose() {
        if (this.spirographController) {
            this.spirographController.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            this.scene.dispose();
        }
        
        if (this.uiPanel) {
            this.uiPanel.dispose();
        }
    }
}

// 创建并初始化应用程序
console.log('Creating app instance...');
const app = new App();
app.init();

// 导出app实例用于调试
window.app = app;
console.log('App instance exported to window.app'); 
