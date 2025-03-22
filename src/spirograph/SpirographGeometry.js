/**
 * SpirographGeometry.js - 螺旋图几何生成器
 * 
 * 作用：
 * 1. 根据数学计算创建螺旋图的THREE.js几何图形
 * 2. 提供不同的几何表示方法(线条、管道等)
 * 3. 优化大量点的几何处理
 * 
 * 被调用：
 * - src/spirograph/SpirographController.js: 用于创建可视化几何体
 * 
 * 调用以下模块：
 * - utils/ThreeLoader.js: 获取THREE实例
 * - math/SpirographEquations.js: 获取点位置计算
 */

import { 
    BufferGeometry, 
    Line,
    Points,
    LineBasicMaterial,
    PointsMaterial
} from 'three';

export class SpirographGeometry {
    /**
     * @param {SpirographModel} model - The data model
     */
    constructor(model) {
        this.model = model;
        
        // Create materials
        this.lineMaterial = new LineBasicMaterial({ 
            color: model.getParams().primaryColor,
            transparent: true,
            opacity: 0.9
        });
        
        this.particleMaterial = new PointsMaterial({
            color: model.getParams().secondaryColor, 
            size: model.getParams().lineThickness * 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        // Create geometries
        this.lineGeometry = new BufferGeometry();
        this.particlesGeometry = new BufferGeometry();
        
        // Create meshes
        this.line = new Line(this.lineGeometry, this.lineMaterial);
        this.particles = new Points(this.particlesGeometry, this.particleMaterial);
    }
    
    /**
     * Update the geometry with current points
     */
    updateGeometry() {
        // Get points from the model
        const points = this.model.getPoints();
        
        // Clean up old geometries
        if (this.lineGeometry) this.lineGeometry.dispose();
        if (this.particlesGeometry) this.particlesGeometry.dispose();
        
        // Create new geometries
        this.lineGeometry = new BufferGeometry().setFromPoints(points);
        this.particlesGeometry = new BufferGeometry().setFromPoints(points);
        
        // Update meshes with new geometries
        this.line.geometry = this.lineGeometry;
        this.particles.geometry = this.particlesGeometry;
    }
    
    /**
     * Update materials based on current parameters
     */
    updateMaterials() {
        const params = this.model.getParams();
        
        // Update colors
        this.lineMaterial.color.set(params.primaryColor);
        this.particleMaterial.color.set(params.secondaryColor);
        
        // Update particle size based on line thickness
        this.particleMaterial.size = params.lineThickness * 0.5;
        this.particleMaterial.needsUpdate = true;
    }
    
    /**
     * Get the line mesh
     * @returns {Line} Line mesh
     */
    getLine() {
        return this.line;
    }
    
    /**
     * Get the particles mesh
     * @returns {Points} Particles mesh
     */
    getParticles() {
        return this.particles;
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        this.lineGeometry.dispose();
        this.particlesGeometry.dispose();
        this.lineMaterial.dispose();
        this.particleMaterial.dispose();
    }
} 