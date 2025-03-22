/**
 * SpirographEquations.js
 * Contains all mathematical formulas for calculating spirograph positions and derivatives
 */

import { waitForThree } from '../utils/ThreeLoader.js';

// Global cache for Vector3 constructor
let Vector3Constructor = null;

/**
 * Get Vector3 constructor
 * @returns {Promise<Function>} Vector3 constructor
 */
async function getVector3() {
    if (Vector3Constructor) {
        return Vector3Constructor;
    }
    
    const THREE = await waitForThree();
    if (!THREE) {
        console.error('Failed to load THREE');
        return null;
    }
    
    Vector3Constructor = THREE.Vector3;
    return Vector3Constructor;
}

/**
 * Create a new Vector3 instance
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @returns {Object} Vector3 instance
 */
function createVector3(x, y, z) {
    if (Vector3Constructor) {
        return new Vector3Constructor(x, y, z);
    }
    
    // Fallback if Vector3 is not available yet
    return { x, y, z, isTemporary: true };
}

/**
 * Calculate the position of a point on the spirograph
 * 
 * @param {number} t - Parameter value
 * @param {object} params - Spirograph parameters
 * @returns {Vector3} - 3D position
 */
export function getSpirographPosition(t, params) {
    const { outerRadius, innerRadius, penOffset, heightAmplitude } = params;
    
    // Basic spirograph equations for x and z
    const x = (outerRadius - innerRadius) * Math.cos(t) + penOffset * Math.cos((outerRadius - innerRadius) * t / innerRadius);
    const z = (outerRadius - innerRadius) * Math.sin(t) - penOffset * Math.sin((outerRadius - innerRadius) * t / innerRadius);
    
    // Add y-coordinate (height) based on a sine wave that varies with t
    // This creates a wave pattern in the vertical direction
    const y = heightAmplitude * Math.sin(3 * t) * Math.cos(2 * t);
    
    return createVector3(x, y, z);
}

/**
 * Calculate the derivative (tangent) at a point on the spirograph
 * 
 * @param {number} t - Parameter value
 * @param {object} params - Spirograph parameters
 * @returns {Vector3} - Normalized tangent vector
 */
export function getSpirographDerivative(t, params) {
    const { outerRadius, innerRadius, penOffset, heightAmplitude } = params;
    
    // Calculate derivatives in x, y, z directions
    const dxdt = -(outerRadius - innerRadius) * Math.sin(t) - 
                 penOffset * (outerRadius - innerRadius) / innerRadius * Math.sin((outerRadius - innerRadius) * t / innerRadius);
    
    const dzdt = (outerRadius - innerRadius) * Math.cos(t) - 
                penOffset * (outerRadius - innerRadius) / innerRadius * Math.cos((outerRadius - innerRadius) * t / innerRadius);
    
    const dydt = heightAmplitude * (3 * Math.cos(3 * t) * Math.cos(2 * t) - 2 * Math.sin(3 * t) * Math.sin(2 * t));
    
    // Create vector without normalization
    const vector = createVector3(dxdt, dydt, dzdt);
    
    // Normalize if it's a real Vector3
    if (Vector3Constructor && vector instanceof Vector3Constructor) {
        return vector.normalize();
    }
    
    // Simple normalization for fallback object
    const length = Math.sqrt(dxdt*dxdt + dydt*dydt + dzdt*dzdt);
    if (length > 0) {
        vector.x /= length;
        vector.y /= length;
        vector.z /= length;
    }
    
    return vector;
}

/**
 * Calculate the position of the inner gear
 * 
 * @param {number} t - Parameter value
 * @param {object} params - Spirograph parameters
 * @returns {Vector3} - 3D position of inner gear center
 */
export function getInnerGearPosition(t, params) {
    const { outerRadius, innerRadius, heightAmplitude } = params;
    
    const x = (outerRadius - innerRadius) * Math.cos(t);
    // Add some height variation to the gear as well, use reduced amplitude
    const y = heightAmplitude * 0.3 * Math.sin(3 * t);
    const z = (outerRadius - innerRadius) * Math.sin(t);
    
    return createVector3(x, y, z);
}

// Initialize Vector3 constructor
getVector3(); 