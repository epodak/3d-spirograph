/**
 * ThreeLoader.js
 * Helper to ensure Three.js is loaded before using it
 */

/**
 * Waits for Three.js to be loaded
 * @returns {Promise} Promise that resolves when Three.js is available
 */
export function waitForThree() {
    return new Promise((resolve) => {
        console.log('Waiting for THREE to be loaded...');
        
        // Check if THREE is already available as global variable
        if (typeof window.THREE !== 'undefined') {
            console.log('THREE is already available as window.THREE');
            resolve(window.THREE);
            return;
        }
        
        // Check if THREE is directly available (loaded from CDN)
        if (typeof THREE !== 'undefined') {
            console.log('THREE is available as global THREE');
            // Store in window for consistency
            window.THREE = THREE;
            resolve(THREE);
            return;
        }

        console.log('THREE not immediately available, checking periodically...');
        
        // Start periodic checking
        const interval = setInterval(() => {
            if (typeof window.THREE !== 'undefined') {
                clearInterval(interval);
                console.log('Found THREE in window.THREE');
                resolve(window.THREE);
                return;
            }
            
            if (typeof THREE !== 'undefined') {
                clearInterval(interval);
                console.log('Found THREE in global scope');
                window.THREE = THREE;
                resolve(THREE);
                return;
            }
        }, 100);
        
        // Set a timeout to prevent infinite waiting
        setTimeout(() => {
            clearInterval(interval);
            console.error('Timeout waiting for THREE to load');
            
            // Try one last approach - maybe the script is loaded but not exposed properly
            if (typeof window.THREE === 'undefined' && typeof THREE === 'undefined') {
                // Try to load THREE from CDN directly via a script tag
                console.log('Attempting to load THREE.js directly...');
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
                script.onload = () => {
                    console.log('THREE.js loaded via script tag');
                    if (typeof THREE !== 'undefined') {
                        window.THREE = THREE;
                        resolve(THREE);
                    } else {
                        console.error('Failed to load THREE.js');
                        resolve(null);
                    }
                };
                script.onerror = () => {
                    console.error('Failed to load THREE.js from CDN');
                    resolve(null);
                };
                document.head.appendChild(script);
            } else {
                resolve(null);
            }
        }, 5000);
    });
}

/**
 * Waits for a specific Three.js component to be loaded
 * @param {string} componentName - Name of the component (e.g., 'OrbitControls')
 * @returns {Promise} Promise that resolves when the component is available
 */
export function waitForThreeComponent(componentName) {
    return new Promise((resolve) => {
        console.log(`Waiting for THREE.${componentName} to be loaded...`);
        
        // First wait for THREE to be loaded
        waitForThree().then((THREE) => {
            if (!THREE) {
                console.error(`Cannot load ${componentName} because THREE is not available`);
                resolve(null);
                return;
            }
            
            // If component is already loaded, resolve immediately
            if (THREE[componentName]) {
                console.log(`${componentName} already available`);
                resolve(THREE[componentName]);
                return;
            }
            
            // Otherwise, check periodically
            console.log(`${componentName} not immediately available, checking periodically...`);
            const interval = setInterval(() => {
                if (THREE[componentName]) {
                    clearInterval(interval);
                    console.log(`Found ${componentName}`);
                    resolve(THREE[componentName]);
                }
            }, 100);
            
            // Set a timeout to prevent infinite waiting
            setTimeout(() => {
                clearInterval(interval);
                console.error(`Timeout waiting for THREE.${componentName} to load`);
                
                // Try to load the component directly based on componentName
                if (componentName === 'OrbitControls') {
                    console.log('Attempting to load OrbitControls directly...');
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                    script.onload = () => {
                        console.log('OrbitControls loaded via script tag');
                        if (THREE.OrbitControls) {
                            resolve(THREE.OrbitControls);
                        } else {
                            console.error('Failed to load OrbitControls');
                            resolve(null);
                        }
                    };
                    script.onerror = () => {
                        console.error('Failed to load OrbitControls from CDN');
                        resolve(null);
                    };
                    document.head.appendChild(script);
                } else {
                    resolve(null);
                }
            }, 5000);
        });
    });
} 