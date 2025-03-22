/**
 * CameraController.js
 * Manages camera functionality including the rollercoaster mode
 */

import { Vector3 } from 'three';
import { getSpirographPosition, getSpirographDerivative } from '../math/SpirographEquations.js';

export class CameraController {
    /**
     * @param {SceneManager} sceneManager - The scene manager
     * @param {RendererManager} rendererManager - The renderer manager
     */
    constructor(sceneManager, rendererManager) {
        this.sceneManager = sceneManager;
        this.rendererManager = rendererManager;
        
        // Get camera reference
        this.camera = sceneManager.getCamera();
        
        // Default camera parameters
        this.params = {
            rollercoasterView: false,
            cameraHeight: 10,
            cameraDistance: 0,
            cameraTilt: 0.2,
            cameraT: 0,
            t: 0
        };
    }
    
    /**
     * Update camera parameters
     * @param {Object} newParams - New camera parameters
     */
    updateParams(newParams) {
        Object.assign(this.params, newParams);
        
        // If in rollercoaster view, update position immediately
        if (this.params.rollercoasterView) {
            this.setCameraToSpirographPosition(this.params.cameraT);
        }
    }
    
    /**
     * Toggle rollercoaster view
     * @param {boolean} enabled - Whether rollercoaster view is enabled
     * @param {Object} spirographParams - Spirograph parameters
     */
    setRollercoasterView(enabled, spirographParams) {
        this.params.rollercoasterView = enabled;
        
        // Update current t value from spirograph
        if (spirographParams) {
            this.params.t = spirographParams.t;
        }
        
        // Enable/disable orbit controls
        this.rendererManager.setControlsEnabled(!enabled);
        
        if (enabled) {
            // Set camera to current position on the spirograph
            this.params.cameraT = this.params.t;
            this.setCameraToSpirographPosition(this.params.cameraT);
        } else {
            // Reset to default camera position
            this.resetCameraPosition();
        }
    }
    
    /**
     * Reset camera to default position
     */
    resetCameraPosition() {
        this.camera.position.set(100, 100, 200);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);
    }
    
    /**
     * Reset camera parameters
     */
    resetCameraParams() {
        this.params.cameraHeight = 10;
        this.params.cameraDistance = 0;
        this.params.cameraTilt = 0.2;
    }
    
    /**
     * Set camera position to a specific point on the spirograph
     * @param {number} t - Parameter value
     */
    setCameraToSpirographPosition(t) {
        // Get spirograph position and tangent at t
        const spirographParams = {
            outerRadius: this.params.outerRadius,
            innerRadius: this.params.innerRadius,
            penOffset: this.params.penOffset,
            heightAmplitude: this.params.heightAmplitude
        };
        
        const pos = getSpirographPosition(t, spirographParams);
        const tangent = getSpirographDerivative(t, spirographParams);
        
        // Calculate up vector perpendicular to tangent
        const worldUp = new Vector3(0, 1, 0);
        const right = new Vector3().crossVectors(tangent, worldUp).normalize();
        const up = new Vector3().crossVectors(right, tangent).normalize();
        
        // Apply height offset
        const heightOffset = new Vector3().copy(up).multiplyScalar(this.params.cameraHeight);
        
        // Apply distance offset along tangent
        const distanceOffset = new Vector3().copy(tangent).multiplyScalar(this.params.cameraDistance);
        
        // Calculate final camera position
        const finalPos = new Vector3().copy(pos).add(heightOffset).add(distanceOffset);
        this.camera.position.copy(finalPos);
        
        // Calculate look-at point (ahead of current position)
        const targetPos = new Vector3().copy(pos).add(tangent.clone().multiplyScalar(5));
        this.camera.lookAt(targetPos);
        
        // Apply camera tilt
        if (this.params.cameraTilt > 0) {
            const center = new Vector3(0, 0, 0);
            const toCenterDir = new Vector3().subVectors(center, pos).normalize();
            const tiltVector = new Vector3().crossVectors(tangent, toCenterDir).normalize();
            this.camera.up.copy(up).lerp(tiltVector, this.params.cameraTilt);
        } else {
            this.camera.up.copy(up);
        }
    }
    
    /**
     * Update camera position for rollercoaster view
     * @param {number} t - Current t value from spirograph
     */
    update(t) {
        if (this.params.rollercoasterView) {
            // Update camera position to match current spirograph point
            this.params.cameraT = t;
            this.setCameraToSpirographPosition(this.params.cameraT);
        }
    }
    
    /**
     * Get camera parameters
     * @returns {Object} Camera parameters
     */
    getParams() {
        return this.params;
    }
} 