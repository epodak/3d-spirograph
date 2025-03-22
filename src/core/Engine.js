/**
 * Engine.js - 应用程序核心引擎
 * 
 * 作用：
 * 1. 作为应用程序的中央协调器
 * 2. 管理动画循环和场景更新
 * 3. 连接各个子系统如渲染器、相机、螺旋图控制器等
 * 
 * 被调用：
 * - src/main.js: 作为应用的主要组件
 * 
 * 调用以下模块：
 * - render/Scene.js
 * - render/Renderer.js
 * - camera/CameraController.js
 * - spirograph/SpirographController.js
 * - utils/ThreeLoader.js
 */

import { SceneManager } from '../render/Scene.js';
import { RendererManager } from '../render/Renderer.js';
import { SpirographController } from '../spirograph/SpirographController.js';
import { GearSystem } from '../gears/GearSystem.js';
import { CameraController } from '../camera/CameraController.js';

export class Engine {
    /**
     * @param {HTMLElement} container - Container element for the renderer
     */
    constructor(container) {
        // Create scene manager
        this.sceneManager = new SceneManager();
        
        // Create renderer manager
        this.rendererManager = new RendererManager(this.sceneManager, container);
        
        // Create spirograph controller
        this.spirographController = new SpirographController(this.sceneManager.getScene());
        
        // Create gear system
        this.gearSystem = new GearSystem(this.sceneManager);
        
        // Create camera controller
        this.cameraController = new CameraController(this.sceneManager, this.rendererManager);
        
        // Auto-rotation flag
        this.autoRotate = true;
        
        // Initialize animation
        this._initAnimation();
    }
    
    /**
     * Initialize animation loop
     * @private
     */
    _initAnimation() {
        // Start animation loop
        this._animate = this._animate.bind(this);
        this._animate();
    }
    
    /**
     * Animation loop
     * @private
     */
    _animate() {
        requestAnimationFrame(this._animate);
        
        // Update spirograph
        const updated = this.spirographController.update();
        
        // Get current spirograph parameter t
        const t = this.spirographController.getParams().t;
        
        // Update gear positions
        this.gearSystem.updatePositions(t);
        
        // Update camera position in rollercoaster view
        this.cameraController.update(t);
        
        // Auto-rotate the patterns if enabled and not in rollercoaster view
        if (this.autoRotate && !this.cameraController.getParams().rollercoasterView) {
            this._autoRotate();
        }
        
        // Render scene
        this.rendererManager.render();
    }
    
    /**
     * Auto-rotate the scene elements
     * @private
     */
    _autoRotate() {
        // Rotate spirograph pattern
        this.spirographController.getGroup().rotation.y += 0.001;
        
        // Rotate grid helper
        this.sceneManager.getGridHelper().rotation.y += 0.001;
        
        // Rotate gear group if visible
        if (this.gearSystem.getParams().showGears) {
            this.gearSystem.getGroup().rotation.y += 0.001;
        }
    }
    
    /**
     * Update parameters of all components
     * @param {Object} params - Parameter values to update
     */
    updateParams(params) {
        // Update spirograph parameters
        this.spirographController.updateParams(params);
        
        // Update gear system parameters
        this.gearSystem.updateParams(params);
        
        // Update camera parameters
        this.cameraController.updateParams(params);
        
        // Update auto-rotation flag
        if (params.hasOwnProperty('autoRotate')) {
            this.autoRotate = params.autoRotate;
        }
    }
    
    /**
     * Set rollercoaster view
     * @param {boolean} enabled - Whether rollercoaster view is enabled
     */
    setRollercoasterView(enabled) {
        const spirographParams = this.spirographController.getParams();
        this.cameraController.setRollercoasterView(enabled, spirographParams);
    }
    
    /**
     * Reset parameters and clear spirograph
     */
    reset() {
        this.spirographController.reset();
    }
    
    /**
     * Clear the spirograph
     */
    clear() {
        this.spirographController.clear();
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        this.rendererManager.handleResize();
    }
    
    /**
     * Clean up all resources
     */
    dispose() {
        this.spirographController.dispose();
        this.gearSystem.dispose();
        this.rendererManager.dispose();
    }
} 