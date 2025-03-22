/**
 * ControlPanel.js
 * Manages the UI control panel and user interactions
 */

export class ControlPanel {
    /**
     * @param {Engine} engine - The main engine
     */
    constructor(engine) {
        this.engine = engine;
        
        // Get DOM elements
        this._getElements();
        
        // Add event listeners
        this._setupEventListeners();
        
        // Initially hide camera controls
        this.cameraControlsDiv.style.display = 'none';
    }
    
    /**
     * Get all required DOM elements
     * @private
     */
    _getElements() {
        // Sliders for spirograph parameters
        this.outerRadiusInput = document.getElementById('outer-radius');
        this.innerRadiusInput = document.getElementById('inner-radius');
        this.penOffsetInput = document.getElementById('pen-offset');
        this.heightAmplitudeInput = document.getElementById('height-amplitude');
        this.speedInput = document.getElementById('speed');
        this.lineThicknessInput = document.getElementById('line-thickness');
        
        // Color pickers
        this.primaryColorInput = document.getElementById('primary-color');
        this.secondaryColorInput = document.getElementById('secondary-color');
        
        // Checkboxes
        this.showGearsCheckbox = document.getElementById('show-gears');
        this.rollercoasterViewCheckbox = document.getElementById('rollercoaster-view');
        
        // Buttons
        this.resetBtn = document.getElementById('reset-btn');
        this.clearBtn = document.getElementById('clear-btn');
        
        // Camera controls
        this.cameraControlsDiv = document.getElementById('camera-controls');
        this.cameraHeightInput = document.getElementById('camera-height');
        this.cameraDistanceInput = document.getElementById('camera-distance');
        this.cameraTiltInput = document.getElementById('camera-tilt');
        this.resetCameraBtn = document.getElementById('reset-camera-btn');
        
        // Mobile controls
        this.toggleBtn = document.getElementById('toggleControls');
        this.infoPanel = document.getElementById('info');
    }
    
    /**
     * Set up all event listeners
     * @private
     */
    _setupEventListeners() {
        // Geometry parameter inputs
        [
            this.outerRadiusInput,
            this.innerRadiusInput,
            this.penOffsetInput,
            this.heightAmplitudeInput,
            this.speedInput,
            this.lineThicknessInput
        ].forEach(input => {
            input.addEventListener('input', this._handleGeometryChange.bind(this));
        });
        
        // Color inputs
        [
            this.primaryColorInput,
            this.secondaryColorInput
        ].forEach(input => {
            input.addEventListener('input', this._handleColorChange.bind(this));
        });
        
        // Show gears checkbox
        this.showGearsCheckbox.addEventListener('change', this._handleShowGearsChange.bind(this));
        
        // Rollercoaster view checkbox
        this.rollercoasterViewCheckbox.addEventListener('change', this._handleRollercoasterViewChange.bind(this));
        
        // Camera control inputs
        [
            this.cameraHeightInput,
            this.cameraDistanceInput,
            this.cameraTiltInput
        ].forEach(input => {
            input.addEventListener('input', this._handleCameraChange.bind(this));
        });
        
        // Reset camera button
        this.resetCameraBtn.addEventListener('click', this._handleResetCamera.bind(this));
        
        // Reset and clear buttons
        this.resetBtn.addEventListener('click', () => this.engine.reset());
        this.clearBtn.addEventListener('click', () => this.engine.clear());
        
        // Mobile toggle button
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', this._handleTogglePanel.bind(this));
        }
        
        // Window resize
        window.addEventListener('resize', this._handleWindowResize.bind(this));
    }
    
    /**
     * Handle changes to geometry parameters
     * @private
     */
    _handleGeometryChange() {
        const params = {
            outerRadius: parseFloat(this.outerRadiusInput.value),
            innerRadius: parseFloat(this.innerRadiusInput.value),
            penOffset: parseFloat(this.penOffsetInput.value),
            heightAmplitude: parseFloat(this.heightAmplitudeInput.value),
            speed: parseFloat(this.speedInput.value),
            lineThickness: parseFloat(this.lineThicknessInput.value)
        };
        
        this.engine.updateParams(params);
    }
    
    /**
     * Handle changes to colors
     * @private
     */
    _handleColorChange() {
        const params = {
            primaryColor: this.primaryColorInput.value,
            secondaryColor: this.secondaryColorInput.value
        };
        
        this.engine.updateParams(params);
    }
    
    /**
     * Handle show gears checkbox change
     * @private
     */
    _handleShowGearsChange() {
        const params = {
            showGears: this.showGearsCheckbox.checked
        };
        
        this.engine.updateParams(params);
    }
    
    /**
     * Handle rollercoaster view checkbox change
     * @private
     */
    _handleRollercoasterViewChange() {
        const enabled = this.rollercoasterViewCheckbox.checked;
        
        // Update rollercoaster view
        this.engine.setRollercoasterView(enabled);
        
        // Show/hide camera controls
        this.cameraControlsDiv.style.display = enabled ? 'block' : 'none';
    }
    
    /**
     * Handle camera parameter changes
     * @private
     */
    _handleCameraChange() {
        const params = {
            cameraHeight: parseFloat(this.cameraHeightInput.value),
            cameraDistance: parseFloat(this.cameraDistanceInput.value),
            cameraTilt: parseFloat(this.cameraTiltInput.value)
        };
        
        this.engine.updateParams(params);
    }
    
    /**
     * Handle reset camera button click
     * @private
     */
    _handleResetCamera() {
        // Reset camera control inputs
        this.cameraHeightInput.value = "10";
        this.cameraDistanceInput.value = "0";
        this.cameraTiltInput.value = "0.2";
        
        // Update camera parameters
        this._handleCameraChange();
    }
    
    /**
     * Handle window resize
     * @private
     */
    _handleWindowResize() {
        this.engine.handleResize();
    }
    
    /**
     * Toggle control panel visibility (for mobile)
     * @private
     */
    _handleTogglePanel() {
        this.infoPanel.classList.toggle('open');
    }
    
    /**
     * Randomize spirograph parameters
     */
    randomizeParameters() {
        // Generate random values
        this.outerRadiusInput.value = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
        
        // Make sure inner radius is less than outer radius
        const maxInnerRadius = Math.min(90, this.outerRadiusInput.value - 10);
        this.innerRadiusInput.value = Math.floor(Math.random() * (maxInnerRadius - 10 + 1)) + 10;
        
        // Random pen offset
        this.penOffsetInput.value = Math.floor(Math.random() * (120 - 20 + 1)) + 20;
        
        // Random height amplitude
        this.heightAmplitudeInput.value = Math.floor(Math.random() * 101);
        
        // Trigger change event
        this._handleGeometryChange();
    }
} 