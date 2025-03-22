/**
 * GearSystem.js
 * Manages the visualization of gears in the spirograph
 */

import { 
    Group, 
    Mesh, 
    RingGeometry, 
    MeshBasicMaterial,
    SphereGeometry,
    Line,
    BufferGeometry,
    LineBasicMaterial,
    Vector3
} from 'three';

import { getInnerGearPosition, getSpirographPosition } from '../math/SpirographEquations.js';

export class GearSystem {
    /**
     * @param {SceneManager} sceneManager - The scene manager
     */
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        
        // Parameters
        this.params = {
            outerRadius: 80,
            innerRadius: 40,
            penOffset: 60,
            heightAmplitude: 30,
            primaryColor: '#ff0066',
            showGears: false
        };
        
        // Create a group to hold all gear elements
        this.group = new Group();
        
        // Add to scene
        sceneManager.add(this.group);
        
        // Create gear elements
        this._createGearElements();
        
        // Initially update visibility
        this.updateVisibility();
    }
    
    /**
     * Create all gear visualization elements
     * @private
     */
    _createGearElements() {
        // Outer gear (fixed)
        const outerGearGeometry = new RingGeometry(79, 80, 64);
        const outerGearMaterial = new MeshBasicMaterial({ 
            color: 0x66bbff,
            transparent: true,
            opacity: 0.7,
            side: 2 // DoubleSide
        });
        this.outerGear = new Mesh(outerGearGeometry, outerGearMaterial);
        this.outerGear.rotation.x = Math.PI / 2; // Rotate to lie in XZ plane
        this.outerGear.position.y = 40;
        
        // Inner gear (moving)
        const innerGearGeometry = new RingGeometry(39, 40, 64);
        const innerGearMaterial = new MeshBasicMaterial({ 
            color: 0xffdd44,
            transparent: true,
            opacity: 0.7,
            side: 2 // DoubleSide
        });
        this.innerGear = new Mesh(innerGearGeometry, innerGearMaterial);
        this.innerGear.rotation.x = Math.PI / 2; // Rotate to lie in XZ plane
        
        // Pen (drawing point)
        const penGeometry = new SphereGeometry(3, 16, 16);
        this.penMaterial = new MeshBasicMaterial({ color: 0xff3377 });
        this.pen = new Mesh(penGeometry, this.penMaterial);
        
        // Pen arm (connecting inner gear to pen)
        const penArmGeometry = new BufferGeometry();
        this.penArmMaterial = new LineBasicMaterial({ 
            color: 0xff3377,
            transparent: true,
            opacity: 0.9
        });
        this.penArm = new Line(penArmGeometry, this.penArmMaterial);
        
        // Add all elements to the group
        this.group.add(this.outerGear);
        this.group.add(this.innerGear);
        this.group.add(this.pen);
        this.group.add(this.penArm);
    }
    
    /**
     * Update gear geometry based on current parameters
     */
    updateGeometry() {
        // Update outer gear geometry
        if (this.outerGear.geometry) {
            this.outerGear.geometry.dispose();
        }
        this.outerGear.geometry = new RingGeometry(
            this.params.outerRadius - 1, 
            this.params.outerRadius, 
            64
        );
        
        // Update inner gear geometry
        if (this.innerGear.geometry) {
            this.innerGear.geometry.dispose();
        }
        this.innerGear.geometry = new RingGeometry(
            this.params.innerRadius - 1, 
            this.params.innerRadius, 
            64
        );
    }
    
    /**
     * Update gear materials (colors)
     */
    updateMaterials() {
        // Update pen and arm colors to match primary color
        this.penMaterial.color.set(this.params.primaryColor);
        this.penArmMaterial.color.set(this.params.primaryColor);
    }
    
    /**
     * Update gear visibility
     */
    updateVisibility() {
        this.group.visible = this.params.showGears;
        this.outerGear.visible = this.params.showGears;
        this.innerGear.visible = this.params.showGears;
        this.pen.visible = this.params.showGears;
        this.penArm.visible = this.params.showGears;
    }
    
    /**
     * Update gear positions based on current t parameter
     * @param {number} t - Current t value
     */
    updatePositions(t) {
        // Only update if gears are visible
        if (!this.params.showGears) return;
        
        // Calculate inner gear position
        const innerPos = getInnerGearPosition(t, this.params);
        this.innerGear.position.set(innerPos.x, innerPos.y, innerPos.z);
        
        // Calculate pen position
        const penPos = getSpirographPosition(t, this.params);
        this.pen.position.set(penPos.x, penPos.y, penPos.z);
        
        // Update pen arm geometry to connect inner gear and pen
        const points = [
            new Vector3(innerPos.x, innerPos.y, innerPos.z),
            new Vector3(penPos.x, penPos.y, penPos.z)
        ];
        
        if (this.penArm.geometry) {
            this.penArm.geometry.dispose();
        }
        this.penArm.geometry = new BufferGeometry().setFromPoints(points);
    }
    
    /**
     * Update gear parameters
     * @param {Object} newParams - New parameter values
     */
    updateParams(newParams) {
        // Update parameters
        Object.assign(this.params, newParams);
        
        // Update gear geometry and visibility
        this.updateGeometry();
        this.updateMaterials();
        this.updateVisibility();
    }
    
    /**
     * Toggle gear visibility
     * @param {boolean} visible - Whether gears should be visible
     */
    setVisible(visible) {
        this.params.showGears = visible;
        this.updateVisibility();
    }
    
    /**
     * Get the gear group
     * @returns {Group} Gear group
     */
    getGroup() {
        return this.group;
    }
    
    /**
     * Clean up resources
     */
    dispose() {
        this.outerGear.geometry.dispose();
        this.innerGear.geometry.dispose();
        this.pen.geometry.dispose();
        if (this.penArm.geometry) this.penArm.geometry.dispose();
        
        this.outerGear.material.dispose();
        this.innerGear.material.dispose();
        this.penMaterial.dispose();
        this.penArmMaterial.dispose();
    }
} 