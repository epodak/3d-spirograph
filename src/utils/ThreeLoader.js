/**
 * ThreeLoader.js - THREE.js加载管理工具
 * 
 * 作用：
 * 1. 确保THREE.js库正确加载
 * 2. 提供异步等待THREE.js加载完成的方法
 * 3. 加载THREE.js的特定组件(如OrbitControls)
 * 
 * 被调用：
 * - app.js: 等待THREE.js加载
 * - render/Scene.js: 获取THREE实例
 * - render/Renderer.js: 获取THREE和OrbitControls实例
 * - spirograph/SpirographController.js: 获取THREE实例
 * - math/SpirographEquations.js: 获取THREE.Vector3
 * 作用：
 * 1. 提供异步THREE.js加载机制
 * 2. 解决THREE.js全局对象的获取问题
 * 3. 支持加载THREE.js组件如OrbitControls
 * 4. 处理CDN加载失败的情况并提供备用方案
 * 
 * 被调用：
 * 几乎被所有使用THREE.js的模块调用，包括：
 * - app.js
 * - render/Scene.js
 * - render/Renderer.js
 * - spirograph/SpirographController.js
 * - math/SpirographEquations.js
 * 
 * 调用外部资源：
 * - THREE.js (全局对象或动态加载)
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