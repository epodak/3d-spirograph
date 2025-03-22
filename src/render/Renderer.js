/**
 * Renderer.js - WebGL渲染器管理
 * 
 * 作用：
 * 1. 创建和配置THREE.js的WebGL渲染器
 * 2. 设置渲染尺寸和质量选项
 * 3. 提供渲染场景的方法
 * 4. 管理OrbitControls相机控制
 * 
 * 被调用：
 * - app.js: 初始化和使用渲染器
 * 
 * 调用以下模块：
 * - utils/ThreeLoader.js: 获取THREE.js实例和组件
 */

import { waitForThree, waitForThreeComponent } from '../utils/ThreeLoader.js';

export class RendererManager {
    /**
     * @param {SceneManager} sceneManager - The scene manager
     * @param {HTMLElement} container - Container element for the renderer
     */
    constructor(sceneManager, container) {
        // Store references
        this.sceneManager = sceneManager;
        this.container = container;
        
        // Initialize renderer when Three.js is loaded
        this.initRenderer();
    }
    
    /**
     * Initialize renderer after THREE is loaded
     */
    async initRenderer() {
        try {
            // Wait for THREE to be loaded
            const THREE = await waitForThree();
            if (!THREE) {
                console.error('Failed to load THREE');
                return;
            }
            
            console.log('THREE loaded successfully', THREE);
            
            // Create renderer
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true 
            });
            
            // Configure renderer
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x111111); // Dark background
            
            // Add to container
            this.container.prepend(this.renderer.domElement);
            
            // Setup orbit controls
            await this.setupOrbitControls();
            
            // Handle window resize
            window.addEventListener('resize', this.handleResize.bind(this));
        } catch (error) {
            console.error('Error initializing renderer:', error);
        }
    }
    
    /**
     * Setup orbit controls after THREE.OrbitControls is loaded
     */
    async setupOrbitControls() {
        try {
            // Get THREE
            const THREE = await waitForThree();
            if (!THREE) {
                console.error('Failed to load THREE');
                return;
            }
            
            console.log('Setting up OrbitControls...');
            
            // Wait for the OrbitControls component to be ready
            await waitForThreeComponent('OrbitControls');
            
            // If OrbitControls still not available, show error
            if (!THREE.OrbitControls) {
                console.error('OrbitControls not available');
                return;
            }
            
            console.log('OrbitControls loaded successfully');
            
            // Create controls
            this.controls = new THREE.OrbitControls(
                this.sceneManager.getCamera(), 
                this.renderer.domElement
            );
            
            // Configure controls
            this.configureControls();
        } catch (error) {
            console.error('Error setting up OrbitControls:', error);
        }
    }
    
    /**
     * Configure orbit controls
     */
    configureControls() {
        if (!this.controls) return;
        
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.renderer) return;
        
        // Update camera aspect ratio
        this.sceneManager.updateSize(window.innerWidth, window.innerHeight);
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Enable or disable orbit controls
     * @param {boolean} enabled - Whether controls should be enabled
     */
    setControlsEnabled(enabled) {
        if (this.controls) {
            this.controls.enabled = enabled;
        }
    }
    
    /**
     * Render the scene
     */
    render() {
        if (!this.renderer) return;
        
        // Update controls if they exist
        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }
        
        // Render scene
        this.renderer.render(
            this.sceneManager.getScene(), 
            this.sceneManager.getCamera()
        );
    }
    
    /**
     * Get the renderer
     * @returns {WebGLRenderer} The renderer
     */
    getRenderer() {
        return this.renderer;
    }
    
    /**
     * Get the controls
     * @returns {OrbitControls} The orbit controls
     */
    getControls() {
        return this.controls;
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        if (this.controls) {
            this.controls.dispose();
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
} 