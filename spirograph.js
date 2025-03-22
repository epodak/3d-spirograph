document.addEventListener('DOMContentLoaded', () => {
    // Log at the start to help with debugging
    console.log('Spirograph script starting...');
    
    // DOM元素获取
    // 获取控制外圆半径的输入元素
    const outerRadiusInput = document.getElementById('outer-radius');
    // 获取控制内圆半径的输入元素
    const innerRadiusInput = document.getElementById('inner-radius');
    // 获取控制画笔偏移量的输入元素
    const penOffsetInput = document.getElementById('pen-offset');
    // 获取控制高度振幅的输入元素
    const heightAmplitudeInput = document.getElementById('height-amplitude');
    // 获取控制绘制速度的输入元素
    const speedInput = document.getElementById('speed');
    // 获取控制线条粗细的输入元素
    const lineThicknessInput = document.getElementById('line-thickness');
    // 获取控制主要颜色的输入元素
    const primaryColorInput = document.getElementById('primary-color');
    // 获取控制次要颜色的输入元素
    const secondaryColorInput = document.getElementById('secondary-color');
    // 获取控制是否显示齿轮的复选框元素
    const showGearsCheckbox = document.getElementById('show-gears');
    // 获取控制是否启用过山车视角的复选框元素
    const rollercoasterViewCheckbox = document.getElementById('rollercoaster-view');
    // 获取重置按钮元素
    const resetBtn = document.getElementById('reset-btn');
    // 获取清除按钮元素
    const clearBtn = document.getElementById('clear-btn');
    
    // 相机控制相关DOM元素
    // 获取相机控制面板的容器元素
    const cameraControlsDiv = document.getElementById('camera-controls');
    // 获取控制相机高度的输入元素
    const cameraHeightInput = document.getElementById('camera-height');
    // 获取控制相机距离的输入元素
    const cameraDistanceInput = document.getElementById('camera-distance');
    // 获取控制相机倾斜角度的输入元素
    const cameraTiltInput = document.getElementById('camera-tilt');
    // 获取重置相机设置的按钮元素
    const resetCameraBtn = document.getElementById('reset-camera-btn');


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

        // 添加光源
        // 创建环境光，提供柔和的全局照明
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        console.log('Ambient light added');

        // 创建平行光源，模拟太阳光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1); // 设置光源位置
        scene.add(directionalLight);
        console.log('Directional light added');

        // 添加额外的平行光源，从另一个角度提供照明，增强场景光照效果
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(1, 0.5, -1); // 设置第二个光源的位置
        scene.add(directionalLight2);

        // 添加网格辅助线，帮助visualize场景的3D空间
        const gridHelper = new THREE.GridHelper(200, 50, 0x444444, 0x222222);
        scene.add(gridHelper);
        console.log('Grid helper added');

        // 添加轨道控制器，允许用户通过鼠标或触摸来旋转、缩放和平移场景
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // 启用阻尼效果，使控制更平滑
        controls.dampingFactor = 0.05; // 设置阻尼系数
        console.log('OrbitControls initialized');


        // 设置相机位置
        camera.position.set(100, 100, 200);
        camera.lookAt(0, 0, 0); // 设置相机朝向场景中心

        // 创建一个组来存放螺旋图案
        const patternGroup = new THREE.Group();
        scene.add(patternGroup);

        // 创建齿轮可视化对象
        // 外部齿轮（固定） - 增加亮度以在深色背景上更加可见
        const outerGearGeometry = new THREE.RingGeometry(79, 80, 64);
        const outerGearMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x66bbff, // 设置为浅蓝色
            transparent: true, // 启用透明效果
            opacity: 0.7, // 设置透明度
            side: THREE.DoubleSide // 使几何体的两面都可见
        });
        const outerGear = new THREE.Mesh(outerGearGeometry, outerGearMaterial);
        outerGear.rotation.x = Math.PI / 2; // 旋转使其平躺在XZ平面上
        outerGear.position.y = 40;
        
        // 内部齿轮（移动） - 增加亮度以在深色背景上更加可见
        const innerGearGeometry = new THREE.RingGeometry(39, 40, 64);
        const innerGearMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffdd44, // 设置为亮黄色
            transparent: true, // 启用透明效果
            opacity: 0.7, // 设置透明度
            side: THREE.DoubleSide // 使几何体的两面都可见
        });
        const innerGear = new THREE.Mesh(innerGearGeometry, innerGearMaterial);
        innerGear.rotation.x = Math.PI / 2; // 旋转使其平躺在XZ平面上

        // 画笔点 - 增加亮度以提高可见度
        const penGeometry = new THREE.SphereGeometry(3, 16, 16); // 稍微增大尺寸
        const penMaterial = new THREE.MeshBasicMaterial({ color: 0xff3377 }); // 设置为亮粉色
        const pen = new THREE.Mesh(penGeometry, penMaterial);

        // 连接内部齿轮中心到画笔的线
        const penArmGeometry = new THREE.BufferGeometry();
        const penArmMaterial = new THREE.LineBasicMaterial({ 
            color: 0xff3377, // 与画笔点颜色相同
            transparent: true, // 启用透明效果
            opacity: 0.9 // 设置透明度
        });
        const penArm = new THREE.Line(penArmGeometry, penArmMaterial);

        
        // 创建组来存放齿轮相关的可视化对象
        const gearsGroup = new THREE.Group();
        gearsGroup.add(outerGear);
        gearsGroup.add(innerGear);
        gearsGroup.add(pen);
        gearsGroup.add(penArm);
        scene.add(gearsGroup);

        // 根据复选框的状态设置齿轮组的初始可见性
        gearsGroup.visible = showGearsCheckbox.checked;
        console.log('Gear visibility initially set to:', gearsGroup.visible);

        // 创建空的几何体用于存储螺旋图案的点
        let spirographPoints = [];
        let lineGeometry = new THREE.BufferGeometry();

        // 创建管状几何体作为主要颜色线，而不是简单的线
        // 这将使其更加可见
        const lineMaterial = new THREE.MeshBasicMaterial({ 
            color: primaryColorInput.value,
            transparent: true,
            opacity: 0.9
        });

        // 创建螺旋图案的线条
        let line = new THREE.Line(lineGeometry, lineMaterial);
        patternGroup.add(line);
        console.log('Line added to scene');


        // 粒子系统用于增强视觉效果 - 我们将用它来表现线条的粗细
        let particlesGeometry = new THREE.BufferGeometry();
        const particlesMaterial = new THREE.PointsMaterial({
            color: secondaryColorInput.value, // 使用次要颜色
            size: parseFloat(lineThicknessInput.value) * 0.5, // 基于线条粗细设置粒子大小
            transparent: true, // 启用透明效果
            opacity: 0.8 // 设置透明度
        });
        // 创建粒子系统
        let particles = new THREE.Points(particlesGeometry, particlesMaterial);
        // 将粒子系统添加到图案组中
        patternGroup.add(particles);
        console.log('Particles added to scene');


        // 参数对象，用于存储和控制螺旋图形的各种属性
        let params = {
            outerRadius: parseFloat(outerRadiusInput.value),    // 外圆半径
            innerRadius: parseFloat(innerRadiusInput.value),    // 内圆半径
            penOffset: parseFloat(penOffsetInput.value),        // 画笔偏移量
            heightAmplitude: parseFloat(heightAmplitudeInput.value), // 高度振幅
            speed: parseFloat(speedInput.value),                // 绘制速度
            lineThickness: parseFloat(lineThicknessInput.value), // 线条粗细
            primaryColor: primaryColorInput.value,              // 主要颜色
            secondaryColor: secondaryColorInput.value,          // 次要颜色
            showGears: showGearsCheckbox.checked,               // 是否显示齿轮
            rollercoasterView: rollercoasterViewCheckbox.checked, // 是否启用过山车视角
            t: 0,                                               // 当前参数t（用于计算螺旋图形位置）
            cameraT: 0,                                         // 相机位置的参数t
            cameraOffset: 0,                                    // 相机与当前绘制点的偏移量（设为0使相机位于最前端）
            cameraHeight: parseFloat(cameraHeightInput.value),  // 相机高度偏移
            cameraDistance: parseFloat(cameraDistanceInput.value), // 相机前后距离调整
            cameraTilt: parseFloat(cameraTiltInput.value),      // 相机倾斜程度
            autoRotate: true,                                   // 是否自动旋转
            drawSpeed: 1,                                       // 每帧添加的点数
            maxPoints: 10000,                                   // 螺旋图形的最大点数
            isDrawing: true                                     // 是否正在绘制螺旋图形
        };


        /**
         * 更新参数，不重置螺旋图
         * 此函数从输入元素中读取最新值并更新params对象
         */
        function updateParams() {
            // 更新几何参数
            params.outerRadius = parseFloat(outerRadiusInput.value);
            params.innerRadius = parseFloat(innerRadiusInput.value);
            params.penOffset = parseFloat(penOffsetInput.value);
            params.heightAmplitude = parseFloat(heightAmplitudeInput.value);
            params.speed = parseFloat(speedInput.value);
            params.lineThickness = parseFloat(lineThicknessInput.value);
            
            // 更新颜色
            params.primaryColor = primaryColorInput.value;
            params.secondaryColor = secondaryColorInput.value;
            
            // 更新材质颜色
            lineMaterial.color.set(params.primaryColor);
            particlesMaterial.color.set(params.secondaryColor);
            
            // 根据线条粗细更新粒子大小
            particlesMaterial.size = params.lineThickness * 0.5;
            particlesMaterial.needsUpdate = true;
            
            // 根据速度参数更新绘制速度，确保最小值为1
            params.drawSpeed = Math.max(1, Math.floor(params.speed * 3));
            
            // 如果之前暂停了，继续绘制
            params.isDrawing = true;
            
            // 更新齿轮可视化
            updateGearVisualization();
        }
        
        /**
         * 更新齿轮可视化效果，根据当前参数调整齿轮的几何形状和可见性
         */
        function updateGearVisualization() {
            // 更新外部齿轮
            if (outerGear.geometry) outerGear.geometry.dispose(); // 释放旧的几何体资源
            outerGear.geometry = new THREE.RingGeometry(params.outerRadius - 1, params.outerRadius, 64);
            
            // 更新内部齿轮
            if (innerGear.geometry) innerGear.geometry.dispose(); // 释放旧的几何体资源
            innerGear.geometry = new THREE.RingGeometry(params.innerRadius - 1, params.innerRadius, 64);
            
            // 根据复选框状态更新齿轮的可见性
            gearsGroup.visible = params.showGears;
            outerGear.visible = params.showGears;
            innerGear.visible = params.showGears;
            pen.visible = params.showGears;
            penArm.visible = params.showGears;
            
            console.log('Gear visibility updated in updateGearVisualization:', gearsGroup.visible);
            
            // 注意：画笔点和连接线将在动画循环中更新
        }

        // 监听输入变化
        // 为几何参数和速度相关的输入元素添加事件监听器
        [outerRadiusInput, innerRadiusInput, penOffsetInput, heightAmplitudeInput, speedInput, lineThicknessInput].forEach(
            input => input.addEventListener('input', updateParams)
        );

        // 为颜色输入元素添加事件监听器
        [primaryColorInput, secondaryColorInput].forEach(
            input => input.addEventListener('input', updateColors)
        );

        // 监听齿轮可见性切换
        showGearsCheckbox.addEventListener('change', () => {
            console.log('Checkbox changed, new value:', showGearsCheckbox.checked);
            params.showGears = showGearsCheckbox.checked;
            // 更新齿轮组及其子元素的可见性
            gearsGroup.visible = params.showGears;
            outerGear.visible = params.showGears;
            innerGear.visible = params.showGears;
            pen.visible = params.showGears;
            penArm.visible = params.showGears;
            console.log('Gear visibility updated to:', gearsGroup.visible);
        });


        // 监听过山车视角复选框
        rollercoasterViewCheckbox.addEventListener('change', () => {
            console.log('Rollercoaster view changed, new value:', rollercoasterViewCheckbox.checked);
            params.rollercoasterView = rollercoasterViewCheckbox.checked;
            
            // 显示/隐藏相机控制面板
            cameraControlsDiv.style.display = params.rollercoasterView ? 'block' : 'none';
            
            // 切换视角时，如果启用过山车视角，将相机位置重置到最新的点
            if (params.rollercoasterView) {
                // 禁用OrbitControls，因为我们将手动控制相机
                controls.enabled = false;
                // 重置相机参数，让它位于螺旋图形的最前端（头部）
                params.cameraT = params.t;
                // 立即设置相机位置
                setCameraToPosition(params.cameraT);
            } else {
                // 重新启用OrbitControls
                controls.enabled = true;
                // 恢复相机位置
                camera.position.set(100, 100, 200);
                camera.lookAt(0, 0, 0);
            }
        });

        // 监听相机控制参数的变化
        cameraHeightInput.addEventListener('input', () => {
            params.cameraHeight = parseFloat(cameraHeightInput.value);
        });
        
        cameraDistanceInput.addEventListener('input', () => {
            params.cameraDistance = parseFloat(cameraDistanceInput.value);
        });
        
        cameraTiltInput.addEventListener('input', () => {
            params.cameraTilt = parseFloat(cameraTiltInput.value);
        });
        
        // 复位相机按钮
        resetCameraBtn.addEventListener('click', () => {
            cameraHeightInput.value = "10";
            cameraDistanceInput.value = "0";
            cameraTiltInput.value = "0.2";
            
            params.cameraHeight = 10;
            params.cameraDistance = 0;
            params.cameraTilt = 0.2;
            
            // 立即设置相机位置到当前的最前端
            params.cameraT = params.t;
            if (params.rollercoasterView) {
                setCameraToPosition(params.cameraT);
            }
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

        // 设置相机到曲线上指定参数t的位置（使用切线方向）
        function setCameraToPosition(t) {
            const pos = getSpirographPosition(t);
            const tangent = getSpirographDerivative(t);
            
            // 计算垂直于切线方向的上向量
            const worldUp = new THREE.Vector3(0, 1, 0);
            const right = new THREE.Vector3().crossVectors(tangent, worldUp).normalize();
            const up = new THREE.Vector3().crossVectors(right, tangent).normalize();
            
            // 应用高度偏移
            const heightOffset = new THREE.Vector3().copy(up).multiplyScalar(params.cameraHeight);
            
            // 应用前后距离偏移
            const distanceOffset = new THREE.Vector3().copy(tangent).multiplyScalar(params.cameraDistance);
            
            // 最终位置
            const finalPos = new THREE.Vector3().copy(pos).add(heightOffset).add(distanceOffset);
            camera.position.copy(finalPos);
            
            // 目标点
            const targetPos = new THREE.Vector3().copy(pos).add(tangent.clone().multiplyScalar(5));
            camera.lookAt(targetPos);
            
            // 调整上方向
            if (params.cameraTilt > 0) {
                const center = new THREE.Vector3(0, 0, 0);
                const toCenterDir = new THREE.Vector3().subVectors(center, pos).normalize();
                const tiltVector = new THREE.Vector3().crossVectors(tangent, toCenterDir).normalize();
                camera.up.copy(up).lerp(tiltVector, params.cameraTilt);
            } else {
                camera.up.copy(up);
            }
        }

        // Reset the spirograph completely
        function resetSpirograph() {
            updateParams();
            spirographPoints = [];
            params.t = 0;
            params.cameraT = 0; // 重置相机参数
            params.isDrawing = true;
            updateGeometries();
            
            // 如果当前是在过山车视角，则需要重置相机位置到起点
            if (params.rollercoasterView) {
                setCameraToPosition(params.cameraT);
            }
        }

        // Clear the spirograph
        function clearSpirograph() {
            spirographPoints = [];
            params.t = 0;
            params.cameraT = 0; // 重置相机参数
            params.isDrawing = true;
            updateGeometries();
            
            // 如果当前是在过山车视角，则需要重置相机位置到起点
            if (params.rollercoasterView) {
                setCameraToPosition(params.cameraT);
            }
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

        // 计算螺旋图形在给定参数t处的导数（切线方向）
        function getSpirographDerivative(t) {
            const R = params.outerRadius;
            const r = params.innerRadius;
            const d = params.penOffset;
            const h = params.heightAmplitude;
            
            // 计算x, y, z方向的导数
            const dxdt = -(R - r) * Math.sin(t) - d * (R - r) / r * Math.sin((R - r) * t / r);
            const dzdt = (R - r) * Math.cos(t) - d * (R - r) / r * Math.cos((R - r) * t / r);
            const dydt = h * (3 * Math.cos(3 * t) * Math.cos(2 * t) - 2 * Math.sin(3 * t) * Math.sin(2 * t));
            
            // 返回归一化的导数向量（即单位切线向量）
            return new THREE.Vector3(dxdt, dydt, dzdt).normalize();
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
            // 逐步添加点，而不是一次性添加所有点
            if (params.isDrawing && spirographPoints.length < params.maxPoints) {
                // 根据drawSpeed每帧添加多个点
                for (let i = 0; i < params.drawSpeed; i++) {
                    params.t += 0.01 * params.speed;
                    spirographPoints.push(getSpirographPosition(params.t));
                    
                    // 如果达到最大点数，停止绘制
                    if (spirographPoints.length >= params.maxPoints) {
                        params.isDrawing = false;
                        console.log('绘制螺旋图完成');
                        break;
                    }
                }
                
                updateGeometries();
                return true; // 添加了点
            }
            return false; // 没有添加点
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
            // 更新线条几何体
            if (line) {
                line.geometry.dispose(); // 释放旧的几何体资源
                line.geometry = new THREE.BufferGeometry().setFromPoints(spirographPoints);
            }
            
            // 更新粒子系统
            if (particles && spirographPoints.length > 0) {
                particles.geometry.dispose(); // 释放旧的几何体资源
                particles.geometry = new THREE.BufferGeometry().setFromPoints(spirographPoints);
            }
        }

        // 动画循环
        function animate() {
            requestAnimationFrame(animate); // 请求下一帧动画
            
            // 通过逐步添加点来更新螺旋图
            updateSpirograph();
            
            // 更新齿轮位置
            updateGearPositions(params.t);
            
            // 过山车视角更新
            if (params.rollercoasterView && spirographPoints.length > 0) {
                // 更新相机位置始终与当前绘制的点保持一致（贪吃蛇的头部）
                params.cameraT = params.t;
                
                // 使用通用函数设置相机位置和朝向
                setCameraToPosition(params.cameraT);
            }
            
            // 自动旋转以获得更好的3D效果（仅在非过山车视角时）
            if (params.autoRotate && !params.rollercoasterView) {
                patternGroup.rotation.y += 0.001;
                gridHelper.rotation.y += 0.001;
                
                // 如果我们旋转图案，也旋转齿轮
                if (params.showGears) {
                    gearsGroup.rotation.y += 0.001;
                }
            }
            
            // 仅在非过山车视角时更新控制器
            if (!params.rollercoasterView) {
                controls.update();
            }
            
            renderer.render(scene, camera); // 渲染场景
        }

        // 初始化齿轮
        updateGearVisualization();

        // 开始动画
        console.log('Starting animation loop...');
        animate();
        console.log('Animation started!');
    } catch (error) {
        console.error('Error in spirograph initialization:', error);
        alert('An error occurred while creating the spirograph. See console for details.');
    }
}); 
