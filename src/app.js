/**
 * Main application entry point
 */
import { SceneManager } from './render/Scene.js';
import { RendererManager } from './render/Renderer.js';
import SpirographController from './spirograph/SpirographController.js';
import UIPanel from './ui/UIPanel.js';
import { waitForThree } from './utils/ThreeLoader.js';

console.log('App.js loaded!');

class App {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.spirographController = null;
        this.uiPanel = null;
        console.log('App constructor called');
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing application...');
            
            // Ensure THREE is loaded
            console.log('Waiting for THREE...');
            const THREE = await waitForThree();
            if (!THREE) {
                console.error('Failed to load THREE.js');
                return;
            }
            console.log('THREE.js loaded successfully', THREE);
            
            // Create app container
            const appContainer = document.getElementById('app-container');
            if (!appContainer) {
                console.error('App container not found!');
                return;
            }
            console.log('App container found', appContainer);
            
            // Initialize scene
            console.log('Initializing scene...');
            this.scene = new SceneManager();
            await this.scene.init();
            console.log('Scene initialized', this.scene);
            
            // Initialize renderer
            console.log('Initializing renderer...');
            this.renderer = new RendererManager(this.scene, appContainer);
            await this.renderer.initRenderer();
            console.log('Renderer initialized', this.renderer);
            
            // Initialize spirograph controller
            console.log('Initializing spirograph controller...');
            this.spirographController = new SpirographController(this.scene, this.renderer);
            await this.spirographController.init();
            console.log('Spirograph controller initialized', this.spirographController);
            
            // Initialize UI panel
            console.log('Initializing UI panel...');
            this.uiPanel = new UIPanel(this.spirographController);
            this.uiPanel.init();
            console.log('UI panel initialized', this.uiPanel);
            
            // Set up render loop
            console.log('Starting render loop...');
            this.startRenderLoop();
            
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }
    
    /**
     * Start the render loop
     */
    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update scene
            if (this.scene) {
                this.scene.update();
            }
            
            // Render scene
            if (this.renderer) {
                this.renderer.render();
            }
        };
        
        animate();
        console.log('Render loop started');
    }

    /**
     * Clean up resources when application is destroyed
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

// Create and initialize the application
console.log('Creating app instance...');
const app = new App();
app.init();

// Export app instance for debugging
window.app = app;
console.log('App instance exported to window.app'); 