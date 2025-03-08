document.addEventListener('DOMContentLoaded', () => {
    // Log at the start to help with debugging
    console.log('Spirograph script starting...');
    
    // DOM Elements
    const outerRadiusInput = document.getElementById('outer-radius');
    const innerRadiusInput = document.getElementById('inner-radius');
    const penOffsetInput = document.getElementById('pen-offset');
    const heightAmplitudeInput = document.getElementById('height-amplitude');
    const speedInput = document.getElementById('speed');
    const lineThicknessInput = document.getElementById('line-thickness');
    const primaryColorInput = document.getElementById('primary-color');
    const secondaryColorInput = document.getElementById('secondary-color');
    const showGearsCheckbox = document.getElementById('show-gears');
    const resetBtn = document.getElementById('reset-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded! Check your script imports.');
        alert('Error: Three.js is not loaded. Check console for details.');
        return;
    }

    console.log('Three.js is loaded successfully');

    // Check if OrbitControls is loaded
    if (typeof THREE.OrbitControls === 'undefined') {
        console.error('THREE.OrbitControls is not loaded! Check your script imports.');
        alert('Error: OrbitControls is not loaded. Check console for details.');
        return;
    }

    console.log('OrbitControls is loaded successfully');

    try {
        // Three.js Setup
        const scene = new THREE.Scene();
        console.log('Scene created');
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        console.log('Camera created');
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Back to dark background
        renderer.setClearColor(0x111111);
        
        const container = document.getElementById('container');
        if (!container) {
            console.error('Container element not found!');
            alert('Error: Container element not found!');
            return;
        }
        
        container.prepend(renderer.domElement);
        console.log('Renderer added to container');

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        console.log('Ambient light added');

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);
        console.log('Directional light added');
        
        // Add additional light from another angle for better illumination
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(1, 0.5, -1);
        scene.add(directionalLight2);

        // Add grid helper
        const gridHelper = new THREE.GridHelper(200, 50, 0x444444, 0x222222);
        scene.add(gridHelper);
        console.log('Grid helper added');

        // Add orbit controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        console.log('OrbitControls initialized');

        // Set camera position
        camera.position.set(100, 100, 200);
        camera.lookAt(0, 0, 0);

        // Create a group for the spirograph pattern
        const patternGroup = new THREE.Group();
        scene.add(patternGroup);

        // Create the gear visualization objects
        // Outer gear (fixed) - make it brighter to be more visible on dark background
        const outerGearGeometry = new THREE.RingGeometry(79, 80, 64);
        const outerGearMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x66bbff, 
            transparent: true, 
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const outerGear = new THREE.Mesh(outerGearGeometry, outerGearMaterial);
        outerGear.rotation.x = Math.PI / 2; // Rotate to lie flat on XZ plane
        
        // Inner gear (moving) - make it brighter to be more visible on dark background
        const innerGearGeometry = new THREE.RingGeometry(39, 40, 64);
        const innerGearMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffdd44, 
            transparent: true, 
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const innerGear = new THREE.Mesh(innerGearGeometry, innerGearMaterial);
        innerGear.rotation.x = Math.PI / 2; // Rotate to lie flat on XZ plane
        
        // Pen point - make it brighter for better visibility
        const penGeometry = new THREE.SphereGeometry(3, 16, 16); // Slightly larger
        const penMaterial = new THREE.MeshBasicMaterial({ color: 0xff3377 });
        const pen = new THREE.Mesh(penGeometry, penMaterial);
        
        // Line connecting center of inner gear to pen
        const penArmGeometry = new THREE.BufferGeometry();
        const penArmMaterial = new THREE.LineBasicMaterial({ 
            color: 0xff3377, 
            transparent: true, 
            opacity: 0.9
        });
        const penArm = new THREE.Line(penArmGeometry, penArmMaterial);
        
        // Create group for gears
        const gearsGroup = new THREE.Group();
        gearsGroup.add(outerGear);
        gearsGroup.add(innerGear);
        gearsGroup.add(pen);
        gearsGroup.add(penArm);
        scene.add(gearsGroup);
        
        // Set initial visibility based on checkbox
        gearsGroup.visible = showGearsCheckbox.checked;
        console.log('Gear visibility initially set to:', gearsGroup.visible);

        // Create empty geometry for the spirograph curve
        let spirographPoints = [];
        let lineGeometry = new THREE.BufferGeometry();
        
        // Create a tube for the primary color line instead of a simple line
        // This will make it more visible
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: primaryColorInput.value,
            transparent: true,
            opacity: 0.9
        });
        
        // Create a line for the spirograph pattern
        let line = new THREE.Line(lineGeometry, lineMaterial);
        patternGroup.add(line);
        console.log('Line added to scene');

        // Particles system for enhanced visuals - we'll use this for line thickness
        let particlesGeometry = new THREE.BufferGeometry();
        const particlesMaterial = new THREE.PointsMaterial({
            color: secondaryColorInput.value,
            size: parseFloat(lineThicknessInput.value) * 0.5, // Base particle size on line thickness
            transparent: true,
            opacity: 0.8
        });
        let particles = new THREE.Points(particlesGeometry, particlesMaterial);
        patternGroup.add(particles);
        console.log('Particles added to scene');

        // Parameters
        let params = {
            outerRadius: parseFloat(outerRadiusInput.value),
            innerRadius: parseFloat(innerRadiusInput.value),
            penOffset: parseFloat(penOffsetInput.value),
            heightAmplitude: parseFloat(heightAmplitudeInput.value),
            speed: parseFloat(speedInput.value),
            lineThickness: parseFloat(lineThicknessInput.value),
            primaryColor: primaryColorInput.value,
            secondaryColor: secondaryColorInput.value,
            showGears: showGearsCheckbox.checked,
            t: 0,
            autoRotate: true,
            // Parameters for gradual drawing
            drawSpeed: 1, // Points to add per frame
            maxPoints: 10000, // Maximum points in the spirograph
            isDrawing: true  // Whether the spirograph is currently being drawn
        };

        // Update parameters from inputs without resetting the spirograph
        function updateParams() {
            params.outerRadius = parseFloat(outerRadiusInput.value);
            params.innerRadius = parseFloat(innerRadiusInput.value);
            params.penOffset = parseFloat(penOffsetInput.value);
            params.heightAmplitude = parseFloat(heightAmplitudeInput.value);
            params.speed = parseFloat(speedInput.value);
            params.lineThickness = parseFloat(lineThicknessInput.value);
            params.primaryColor = primaryColorInput.value;
            params.secondaryColor = secondaryColorInput.value;
            
            // Update materials
            lineMaterial.color.set(params.primaryColor);
            particlesMaterial.color.set(params.secondaryColor);
            
            // Update particle size based on line thickness
            particlesMaterial.size = params.lineThickness * 0.5;
            particlesMaterial.needsUpdate = true;
            
            // Update draw speed based on speed parameter
            params.drawSpeed = Math.max(1, Math.floor(params.speed * 3));
            
            // Continue drawing if it was paused
            params.isDrawing = true;
            
            // Update gear visualizations
            updateGearVisualization();
        }
        
        // Update gear visualization based on current parameters
        function updateGearVisualization() {
            // Update outer gear
            if (outerGear.geometry) outerGear.geometry.dispose();
            outerGear.geometry = new THREE.RingGeometry(params.outerRadius - 1, params.outerRadius, 64);
            
            // Update inner gear
            if (innerGear.geometry) innerGear.geometry.dispose();
            innerGear.geometry = new THREE.RingGeometry(params.innerRadius - 1, params.innerRadius, 64);
            
            // Update gears visibility based on checkbox
            gearsGroup.visible = params.showGears;
            outerGear.visible = params.showGears;
            innerGear.visible = params.showGears;
            pen.visible = params.showGears;
            penArm.visible = params.showGears;
            
            console.log('Gear visibility updated in updateGearVisualization:', gearsGroup.visible);
            
            // Pen point and arm will be updated in the animation loop
        }

        // Listen for input changes
        [outerRadiusInput, innerRadiusInput, penOffsetInput, heightAmplitudeInput, speedInput, lineThicknessInput].forEach(
            input => input.addEventListener('input', updateParams)
        );
        
        [primaryColorInput, secondaryColorInput].forEach(
            input => input.addEventListener('input', updateColors)
        );
        
        // Listen for gear visibility toggle
        showGearsCheckbox.addEventListener('change', () => {
            console.log('Checkbox changed, new value:', showGearsCheckbox.checked);
            params.showGears = showGearsCheckbox.checked;
            gearsGroup.visible = params.showGears;
            outerGear.visible = params.showGears;
            innerGear.visible = params.showGears;
            pen.visible = params.showGears;
            penArm.visible = params.showGears;
            console.log('Gear visibility updated to:', gearsGroup.visible);
        });

        function updateColors() {
            params.primaryColor = primaryColorInput.value;
            params.secondaryColor = secondaryColorInput.value;
            lineMaterial.color.set(params.primaryColor);
            particlesMaterial.color.set(params.secondaryColor);
            
            // Update pen color
            penMaterial.color.set(params.primaryColor);
            penArmMaterial.color.set(params.primaryColor);
        }

        // Reset the spirograph completely
        function resetSpirograph() {
            updateParams();
            spirographPoints = [];
            params.t = 0;
            params.isDrawing = true;
            updateGeometries();
        }

        // Clear the spirograph
        function clearSpirograph() {
            spirographPoints = [];
            params.t = 0;
            params.isDrawing = true;
            updateGeometries();
        }

        // Event listeners for buttons
        resetBtn.addEventListener('click', resetSpirograph);
        clearBtn.addEventListener('click', clearSpirograph);

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Calculate spirograph position with 3D height
        function getSpirographPosition(t) {
            const R = params.outerRadius;
            const r = params.innerRadius;
            const d = params.penOffset;
            const h = params.heightAmplitude;
            
            // Basic spirograph equations for x and z
            const x = (R - r) * Math.cos(t) + d * Math.cos((R - r) * t / r);
            const z = (R - r) * Math.sin(t) - d * Math.sin((R - r) * t / r);
            
            // Add y-coordinate (height) based on a sine wave that varies with t
            // This creates a wave pattern in the vertical direction
            const y = h * Math.sin(3 * t) * Math.cos(2 * t);
            
            return new THREE.Vector3(x, y, z);
        }
        
        // Calculate inner gear position (center) with 3D height
        function getInnerGearPosition(t) {
            const R = params.outerRadius;
            const r = params.innerRadius;
            const h = params.heightAmplitude * 0.3; // Reduced amplitude for gear movement
            
            const x = (R - r) * Math.cos(t);
            // Add some height variation to the gear as well
            const y = h * Math.sin(3 * t);
            const z = (R - r) * Math.sin(t);
            
            return new THREE.Vector3(x, y, z);
        }

        // Update spirograph points
        function updateSpirograph() {
            // Add points gradually instead of all at once
            if (params.isDrawing && spirographPoints.length < params.maxPoints) {
                // Add a few points per frame based on drawSpeed
                for (let i = 0; i < params.drawSpeed; i++) {
                    params.t += 0.01 * params.speed;
                    spirographPoints.push(getSpirographPosition(params.t));
                    
                    // Stop if we've reached maximum points
                    if (spirographPoints.length >= params.maxPoints) {
                        params.isDrawing = false;
                        console.log('Finished drawing spirograph');
                        break;
                    }
                }
                
                updateGeometries();
                return true; // Points were added
            }
            return false; // No points were added
        }
        
        // Update the gear positions
        function updateGearPositions(t) {
            // Only update if gears are visible
            if (!params.showGears) return;
            
            // Inner gear position
            const innerPos = getInnerGearPosition(t);
            innerGear.position.set(innerPos.x, innerPos.y, innerPos.z);
            
            // Pen position
            const spirographPos = getSpirographPosition(t);
            pen.position.set(spirographPos.x, spirographPos.y, spirographPos.z);
            
            // Update pen arm
            const points = [
                new THREE.Vector3(innerPos.x, innerPos.y, innerPos.z),
                new THREE.Vector3(spirographPos.x, spirographPos.y, spirographPos.z)
            ];
            penArm.geometry.dispose();
            penArm.geometry = new THREE.BufferGeometry().setFromPoints(points);
        }

        // Update the geometries with new points
        function updateGeometries() {
            // Update line geometry
            if (line) {
                line.geometry.dispose();
                line.geometry = new THREE.BufferGeometry().setFromPoints(spirographPoints);
            }
            
            // Update particles
            if (particles && spirographPoints.length > 0) {
                particles.geometry.dispose();
                particles.geometry = new THREE.BufferGeometry().setFromPoints(spirographPoints);
            }
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Update spirograph by adding points gradually
            updateSpirograph();
            
            // Update gear positions
            updateGearPositions(params.t);
            
            // Auto-rotate for better 3D effect
            if (params.autoRotate) {
                patternGroup.rotation.y += 0.001;
                gridHelper.rotation.y += 0.001;
                
                // If we rotate the pattern, also rotate the gears
                if (params.showGears) {
                    gearsGroup.rotation.y += 0.001;
                }
            }
            
            controls.update();
            renderer.render(scene, camera);
        }

        // Initialize gears
        updateGearVisualization();
        
        // Start the animation
        console.log('Starting animation loop...');
        animate();
        console.log('Animation started!');
    } catch (error) {
        console.error('Error in spirograph initialization:', error);
        alert('An error occurred while creating the spirograph. See console for details.');
    }
}); 
