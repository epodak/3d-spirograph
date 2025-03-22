/**
 * SpirographController.js
 * Manages the generation and visualization of the spirograph
 */

import { getSpirographPosition, getSpirographDerivative, getInnerGearPosition } from '../math/SpirographEquations.js';
import { waitForThree, waitForThreeComponent } from '../utils/ThreeLoader.js';

export default class SpirographController {
    /**
     * @param {import('../render/Scene').SceneManager} sceneManager - Scene manager
     * @param {import('../render/Renderer').RendererManager} rendererManager - Renderer manager
     */
    constructor(sceneManager, rendererManager) {
        this.sceneManager = sceneManager;
        this.rendererManager = rendererManager;
        this.parameters = {
            outerRadius: 5,
            innerRadius: 3,
            penOffset: 2,
            heightAmplitude: 1.5,
            numPoints: 2000,
            curve: null,
            mesh: null,
            innerGear: null,
            outerGear: null,
            pen: null
        };

        this.objects = {
            curve: null,
            mesh: null,
            innerGear: null,
            outerGear: null,
            pen: null
        };

        this.animation = {
            t: 0,
            speed: 0.01,
            playing: false,
            animationId: null
        };
    }

    /**
     * Initialize the spirograph visualization
     */
    async init() {
        // Wait for THREE to be loaded
        const THREE = await waitForThree();
        if (!THREE) {
            console.error('THREE.js not loaded in SpirographController.init()');
            return;
        }

        // Create the spirograph
        await this.createSpirograph();
        
        // Set up animation
        this.startAnimation();
    }

    /**
     * Update spirograph parameters
     * @param {Object} newParams - New parameter values
     */
    async updateParameters(newParams) {
        // Update parameters
        Object.assign(this.parameters, newParams);
        
        // Regenerate the spirograph
        await this.createSpirograph();
    }

    /**
     * Create the spirograph visualization
     */
    async createSpirograph() {
        // Wait for THREE to be loaded
        const THREE = await waitForThree();
        if (!THREE) {
            console.error('THREE.js not loaded in SpirographController.createSpirograph()');
            return;
        }

        // Clean up existing objects
        this.cleanupObjects();

        // Generate points for the spirograph
        const { outerRadius, innerRadius, penOffset, heightAmplitude, numPoints } = this.parameters;
        const params = { outerRadius, innerRadius, penOffset, heightAmplitude };
        const points = [];

        for (let i = 0; i <= numPoints; i++) {
            const t = (i / numPoints) * Math.PI * 20; // Cover enough revolutions
            const point = getSpirographPosition(t, params);
            points.push(point);
        }

        // Create curve
        const curve = new THREE.CatmullRomCurve3(points);
        this.objects.curve = curve;

        // Create the curve's geometry
        await this.createCurveGeometry(curve);
        
        // Create gear visualizations
        await this.createGears();
        
        // Create the pen
        await this.createPen();
    }

    /**
     * Create the curve geometry and add it to the scene
     * @param {THREE.Curve} curve - The spirograph curve
     */
    async createCurveGeometry(curve) {
        // Wait for THREE components to be loaded
        const THREE = await waitForThree();
        if (!THREE) return;

        // Create tube geometry for the curve
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            this.parameters.numPoints / 5, // Number of segments
            0.1, // Tube radius
            8, // Radial segments
            false // Closed
        );

        // Create material with rainbow gradient
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            vertexColors: true
        });

        // Add vertex colors to create rainbow effect
        const colors = [];
        const numVertices = tubeGeometry.getAttribute('position').count;

        for (let i = 0; i < numVertices; i++) {
            // Create rainbow colors
            const hue = i / numVertices;
            const color = new THREE.Color().setHSL(hue, 1.0, 0.5);
            colors.push(color.r, color.g, color.b);
        }

        // Set vertex colors
        tubeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Create mesh and add to scene
        const tubeMesh = new THREE.Mesh(tubeGeometry, material);
        this.objects.mesh = tubeMesh;
        this.sceneManager.add(tubeMesh);
    }

    /**
     * Create gear visualizations
     */
    async createGears() {
        // Wait for THREE components to be loaded
        const THREE = await waitForThree();
        if (!THREE) return;

        // Create outer gear
        const outerGearGeometry = new THREE.RingGeometry(
            this.parameters.outerRadius - 0.2,
            this.parameters.outerRadius + 0.2,
            32
        );
        const outerGearMaterial = new THREE.MeshBasicMaterial({
            color: 0x4444ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const outerGear = new THREE.Mesh(outerGearGeometry, outerGearMaterial);
        this.objects.outerGear = outerGear;
        this.sceneManager.add(outerGear);

        // Create inner gear
        const innerGearGeometry = new THREE.CircleGeometry(this.parameters.innerRadius, 32);
        const innerGearMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const innerGear = new THREE.Mesh(innerGearGeometry, innerGearMaterial);
        this.objects.innerGear = innerGear;
        this.sceneManager.add(innerGear);
    }

    /**
     * Create pen visualization
     */
    async createPen() {
        // Wait for THREE components to be loaded
        const THREE = await waitForThree();
        if (!THREE) return;

        // Create a small sphere to represent the pen
        const penGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const penMaterial = new THREE.MeshBasicMaterial({ color: 0x44ff44 });
        const pen = new THREE.Mesh(penGeometry, penMaterial);
        this.objects.pen = pen;
        this.sceneManager.add(pen);
    }

    /**
     * Start the animation
     */
    startAnimation() {
        if (this.animation.playing) return;
        
        this.animation.playing = true;
        this.animate();
    }

    /**
     * Stop the animation
     */
    stopAnimation() {
        this.animation.playing = false;
        if (this.animation.animationId) {
            cancelAnimationFrame(this.animation.animationId);
            this.animation.animationId = null;
        }
    }

    /**
     * Animation loop
     */
    animate = async () => {
        if (!this.animation.playing) return;

        // Wait for THREE components to be loaded
        const THREE = await waitForThree();
        if (!THREE) return;

        // Update the position of the inner gear and pen
        this.updateGearAndPenPositions();
        
        // Increment t for the next frame
        this.animation.t += this.animation.speed;
        
        // Request next frame
        this.animation.animationId = requestAnimationFrame(this.animate);
    }

    /**
     * Update the position of the inner gear and pen
     */
    updateGearAndPenPositions() {
        if (!this.objects.innerGear || !this.objects.pen) return;

        const t = this.animation.t;
        const params = {
            outerRadius: this.parameters.outerRadius,
            innerRadius: this.parameters.innerRadius,
            penOffset: this.parameters.penOffset,
            heightAmplitude: this.parameters.heightAmplitude
        };

        // Update inner gear position
        const innerGearPos = getInnerGearPosition(t, params);
        this.objects.innerGear.position.set(innerGearPos.x, innerGearPos.y, innerGearPos.z);
        
        // Rotate the inner gear
        this.objects.innerGear.rotation.y = -t * (this.parameters.outerRadius / this.parameters.innerRadius);
        
        // Update pen position
        const penPos = getSpirographPosition(t, params);
        this.objects.pen.position.set(penPos.x, penPos.y, penPos.z);
    }

    /**
     * Clean up existing objects
     */
    cleanupObjects() {
        // Remove existing objects from the scene
        Object.values(this.objects).forEach(obj => {
            if (obj && typeof obj.geometry !== 'undefined') {
                this.sceneManager.remove(obj);
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(mat => mat.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            }
        });

        // Reset objects
        this.objects = {
            curve: null,
            mesh: null,
            innerGear: null,
            outerGear: null,
            pen: null
        };
    }

    /**
     * Dispose resources when controller is destroyed
     */
    dispose() {
        this.stopAnimation();
        this.cleanupObjects();
    }
} 