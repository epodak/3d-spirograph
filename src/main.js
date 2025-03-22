/**
 * main.js
 * Main entry point for the application
 */

import { Engine } from './core/Engine.js';
import { ControlPanel } from './ui/ControlPanel.js';

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('3D Spirograph application starting...');
    
    try {
        // Get container element
        const container = document.getElementById('container');
        if (!container) {
            throw new Error('Container element not found!');
        }
        
        // Create engine
        const engine = new Engine(container);
        
        // Create control panel
        const controlPanel = new ControlPanel(engine);
        
        // Randomize parameters to start with something interesting
        controlPanel.randomizeParameters();
        
        console.log('3D Spirograph application started successfully!');
    } catch (error) {
        console.error('Error initializing 3D Spirograph:', error);
        alert('Error initializing application. See console for details.');
    }
}); 