/**
 * SpirographModel.js - 螺旋图数据模型
 * 
 * 作用：
 * 1. 存储和管理螺旋图的参数
 * 2. 提供参数验证和限制
 * 3. 管理状态信息
 * 
 * 被调用：
 * - src/spirograph/SpirographController.js: 作为数据模型
 * - src/ui/UIPanel.js: 通过控制器更新参数
 * 
 * 调用以下模块：
 * 无直接依赖，主要是数据存储
 */

export class SpirographModel {
    constructor() {
        // Default parameters
        this.params = {
            // Geometric parameters
            outerRadius: 80,
            innerRadius: 40,
            penOffset: 60,
            heightAmplitude: 30,
            
            // Animation parameters
            speed: 1,
            lineThickness: 3,
            primaryColor: '#ff0066',
            secondaryColor: '#00ffcc',
            showGears: false,
            rollercoasterView: false,
            
            // Animation state
            t: 0,               // Current parameter t (for point calculation)
            cameraT: 0,         // Camera position parameter
            isDrawing: true,    // Whether currently drawing
            drawSpeed: 1,       // Points to add per frame
            maxPoints: 10000,   // Maximum number of points
            
            // Camera parameters
            cameraHeight: 10,
            cameraDistance: 0,
            cameraTilt: 0.2,
            autoRotate: true
        };
        
        // Points array for the spirograph curve
        this.points = [];
    }
    
    /**
     * Update parameters from UI inputs
     * @param {Object} newParams - New parameter values
     */
    updateParams(newParams) {
        // Update only the provided parameters
        Object.assign(this.params, newParams);
        
        // Update derived parameters
        this.updateDerivedParams();
    }
    
    /**
     * Update parameters that depend on other parameters
     */
    updateDerivedParams() {
        // Ensure drawSpeed is at least 1
        this.params.drawSpeed = Math.max(1, Math.floor(this.params.speed * 3));
    }
    
    /**
     * Reset the spirograph to initial state
     */
    reset() {
        this.points = [];
        this.params.t = 0;
        this.params.cameraT = 0;
        this.params.isDrawing = true;
    }
    
    /**
     * Adds a new point to the spirograph
     * @param {Vector3} point - Point to add
     */
    addPoint(point) {
        this.points.push(point);
        
        // Stop drawing if maximum points reached
        if (this.points.length >= this.params.maxPoints) {
            this.params.isDrawing = false;
        }
    }
    
    /**
     * Advance the parameter t
     */
    advanceT() {
        this.params.t += 0.01 * this.params.speed;
    }
    
    /**
     * Get all points
     * @returns {Array} Array of points
     */
    getPoints() {
        return this.points;
    }
    
    /**
     * Get current parameters
     * @returns {Object} Current parameters
     */
    getParams() {
        return this.params;
    }
} 