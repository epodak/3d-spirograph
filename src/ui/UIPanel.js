/**
 * UIPanel.js
 * Creates and manages the UI control panel for the spirograph
 */

export default class UIPanel {
    /**
     * @param {import('../spirograph/SpirographController').default} spirographController - Spirograph controller instance
     */
    constructor(spirographController) {
        this.spirographController = spirographController;
        this.container = null;
    }

    /**
     * Initialize the UI panel
     */
    init() {
        this.createPanel();
        this.setupEventListeners();
    }

    /**
     * Create the UI panel
     */
    createPanel() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'ui-panel';
        this.container.innerHTML = `
            <div class="ui-header">
                <h2>Spirograph Controls</h2>
            </div>
            <div class="ui-content">
                <div class="control-group">
                    <label for="outerRadius">Outer Radius:</label>
                    <input type="range" id="outerRadius" min="3" max="10" step="0.1" value="5">
                    <span class="value-display">5</span>
                </div>
                <div class="control-group">
                    <label for="innerRadius">Inner Radius:</label>
                    <input type="range" id="innerRadius" min="1" max="5" step="0.1" value="3">
                    <span class="value-display">3</span>
                </div>
                <div class="control-group">
                    <label for="penOffset">Pen Offset:</label>
                    <input type="range" id="penOffset" min="0.5" max="4" step="0.1" value="2">
                    <span class="value-display">2</span>
                </div>
                <div class="control-group">
                    <label for="heightAmplitude">Height Amplitude:</label>
                    <input type="range" id="heightAmplitude" min="0" max="3" step="0.1" value="1.5">
                    <span class="value-display">1.5</span>
                </div>
                <div class="control-group">
                    <label for="speed">Animation Speed:</label>
                    <input type="range" id="speed" min="0.001" max="0.05" step="0.001" value="0.01">
                    <span class="value-display">0.01</span>
                </div>
                <div class="control-group">
                    <button id="reset-btn">Reset</button>
                    <button id="toggle-animation-btn">Pause</button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .ui-panel {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 300px;
                background-color: rgba(30, 30, 30, 0.8);
                color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                font-family: Arial, sans-serif;
                z-index: 1000;
            }
            
            .ui-header {
                background-color: rgba(50, 50, 50, 0.9);
                padding: 12px 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .ui-header h2 {
                margin: 0;
                font-size: 18px;
            }
            
            .ui-content {
                padding: 15px;
            }
            
            .control-group {
                margin-bottom: 15px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
            }
            
            .control-group label {
                display: block;
                width: 100%;
                margin-bottom: 5px;
                font-size: 14px;
            }
            
            .control-group input[type="range"] {
                width: 85%;
                margin-right: 10px;
            }
            
            .value-display {
                width: 10%;
                text-align: right;
                font-size: 14px;
            }
            
            button {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-right: 10px;
                transition: background-color 0.3s;
            }
            
            button:hover {
                background-color: #2980b9;
            }
        `;

        // Add to document
        document.head.appendChild(style);
        document.body.appendChild(this.container);
    }

    /**
     * Set up event listeners for UI controls
     */
    setupEventListeners() {
        // Get all slider inputs
        const sliders = this.container.querySelectorAll('input[type="range"]');
        
        // Add event listeners to each slider
        sliders.forEach(slider => {
            // Update value display when slider changes
            const updateDisplay = () => {
                const display = slider.nextElementSibling;
                display.textContent = parseFloat(slider.value).toFixed(2);
                
                // Update spirograph parameters
                this.updateSpirographParameters();
            };
            
            slider.addEventListener('input', updateDisplay);
            slider.addEventListener('change', updateDisplay);
            
            // Initialize value display
            updateDisplay();
        });
        
        // Reset button
        const resetBtn = this.container.querySelector('#reset-btn');
        resetBtn.addEventListener('click', () => {
            // Reset all sliders to default values
            this.container.querySelector('#outerRadius').value = '5';
            this.container.querySelector('#innerRadius').value = '3';
            this.container.querySelector('#penOffset').value = '2';
            this.container.querySelector('#heightAmplitude').value = '1.5';
            this.container.querySelector('#speed').value = '0.01';
            
            // Update displays
            sliders.forEach(slider => {
                const display = slider.nextElementSibling;
                display.textContent = parseFloat(slider.value).toFixed(2);
            });
            
            // Update spirograph
            this.updateSpirographParameters();
        });
        
        // Toggle animation button
        const toggleAnimationBtn = this.container.querySelector('#toggle-animation-btn');
        toggleAnimationBtn.addEventListener('click', () => {
            const isPlaying = this.spirographController.animation.playing;
            
            if (isPlaying) {
                this.spirographController.stopAnimation();
                toggleAnimationBtn.textContent = 'Resume';
            } else {
                this.spirographController.startAnimation();
                toggleAnimationBtn.textContent = 'Pause';
            }
        });
    }

    /**
     * Update spirograph parameters based on UI values
     */
    updateSpirographParameters() {
        // Get values from UI
        const outerRadius = parseFloat(this.container.querySelector('#outerRadius').value);
        const innerRadius = parseFloat(this.container.querySelector('#innerRadius').value);
        const penOffset = parseFloat(this.container.querySelector('#penOffset').value);
        const heightAmplitude = parseFloat(this.container.querySelector('#heightAmplitude').value);
        const speed = parseFloat(this.container.querySelector('#speed').value);
        
        // Update animation speed directly
        this.spirographController.animation.speed = speed;
        
        // Update other parameters
        this.spirographController.updateParameters({
            outerRadius,
            innerRadius,
            penOffset,
            heightAmplitude
        });
    }

    /**
     * Clean up resources when UI panel is destroyed
     */
    dispose() {
        // Remove the UI container from the document
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
} 