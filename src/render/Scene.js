/**
 * Scene.js
 * Manages the 3D scene setup and components
 */

import { waitForThree } from '../utils/ThreeLoader.js';

export class SceneManager {
    constructor() {
        // Initialize components once THREE is loaded
        this.init();
    }
    
    /**
     * Initialize scene components
     */
    async init() {
        try {
            // Wait for THREE to be loaded
            const THREE = await waitForThree();
            if (!THREE) {
                console.error('Failed to load THREE');
                return;
            }
            
            console.log('Creating THREE scene');
            
            // Create scene
            this.scene = new THREE.Scene();
            
            // Create camera
            this.camera = new THREE.PerspectiveCamera(
                75,                                     // Field of view
                window.innerWidth / window.innerHeight, // Aspect ratio
                0.1,                                    // Near clipping plane
                1000                                    // Far clipping plane
            );
            
            // Set default camera position
            this.camera.position.set(30, 15, 30);
            this.camera.lookAt(0, 0, 0);
            
            // Setup lighting
            this._setupLighting(THREE);
            
            // Setup helper grid
            this._setupGrid(THREE);
            
            console.log('Scene initialized successfully');
        } catch (error) {
            console.error('Error initializing scene:', error);
        }
    }
    
    /**
     * Set up scene lighting
     * @param {Object} THREE - The Three.js object
     * @private
     */
    _setupLighting(THREE) {
        if (!this.scene) return;
        
        // Ambient light for overall scene illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Main directional light (simulates sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
        
        // Secondary directional light from another angle
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(1, 0.5, -1);
        this.scene.add(directionalLight2);
    }
    
    /**
     * Set up grid helper
     * @param {Object} THREE - The Three.js object
     * @private
     */
    _setupGrid(THREE) {
        if (!this.scene) return;
        
        const gridHelper = new THREE.GridHelper(200, 50, 0x444444, 0x222222);
        this.scene.add(gridHelper);
        this.gridHelper = gridHelper;
    }
    
    /**
     * Update aspect ratio on window resize
     * @param {number} width - Window width
     * @param {number} height - Window height
     */
    updateSize(width, height) {
        if (!this.camera) return;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
    
    /**
     * Add an object to the scene
     * @param {Object3D} object - The object to add
     */
    add(object) {
        if (!this.scene) {
            console.error('Cannot add object - scene not initialized');
            return;
        }
        
        try {
            this.scene.add(object);
        } catch (error) {
            console.error('Error adding object to scene:', error);
        }
    }
    
    /**
     * Remove an object from the scene
     * @param {Object3D} object - The object to remove
     */
    remove(object) {
        if (!this.scene) {
            console.error('Cannot remove object - scene not initialized');
            return;
        }
        
        try {
            this.scene.remove(object);
        } catch (error) {
            console.error('Error removing object from scene:', error);
        }
    }
    
    /**
     * Get the scene
     * @returns {Scene} The scene
     */
    getScene() {
        return this.scene;
    }
    
    /**
     * Get the camera
     * @returns {PerspectiveCamera} The camera
     */
    getCamera() {
        return this.camera;
    }
    
    /**
     * Get the grid helper
     * @returns {GridHelper} The grid helper
     */
    getGridHelper() {
        return this.gridHelper;
    }
    
    /**
     * Update the scene - can be used for auto-rotation effects
     */
    update() {
        // Auto-rotation logic can be added here
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        console.log('Disposing scene resources');
        
        // Nothing specific to dispose in the base scene yet
    }
} 