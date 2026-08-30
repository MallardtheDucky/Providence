        
        let scene, camera, renderer, birdGroup;
        let particlesMesh;

        function initThreeJS() {
            const container = document.getElementById('hero-canvas-container');
            if (!container) return;

            
            const isSmallOrTouch = (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) ||
                (('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 900);
            window.__introIsMobile = isSmallOrTouch;

            scene = new THREE.Scene();
            
            scene.fog = new THREE.FogExp2(0x000000, 0.04);

            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 18;
            camera.position.y = 0;

            
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isSmallOrTouch, powerPreference: 'low-power' });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallOrTouch ? 1.5 : 2));
            container.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight1.position.set(5, 5, 5);
            scene.add(directionalLight1);
            
            const directionalLight2 = new THREE.DirectionalLight(0x4488ff, 0.5);
            directionalLight2.position.set(-5, -5, -5);
            scene.add(directionalLight2);

            birdGroup = new THREE.Group();
            window.birdParts = [];

            const solidMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.2,
                metalness: 0.8,
                side: THREE.DoubleSide,
                flatShading: true,
                transparent: true,
                opacity: 1
            });
            
            const wireMaterial = new THREE.MeshBasicMaterial({
                color: 0x888888,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });

            window.__logoMaterials = { solidMaterial, wireMaterial, solidBase: 1, wireBase: 0.3 };

            const scale = 0.15;
            const cx = 50, cy = 50; 
            
            const p = (x, y) => new THREE.Vector3((x - cx) * scale, (cy - y) * scale, 0);

            const pts = {
                p1: p(15, 40),
                p2: p(25, 35),
                p3: p(25, 45),
                p4: p(40, 35),
                p5: p(30, 55),
                p6: p(50, 30),
                p7: p(50, 55),
                p8: p(75, 35),
                p9: p(95, 40),
                p10: p(60, 75),
                p11: p(40, 90),
                p12: p(40, 65)
            };

            const faces = [
                [pts.p1, pts.p2, pts.p3],
                [pts.p2, pts.p4, pts.p5],
                [pts.p4, pts.p6, pts.p5],
                [pts.p6, pts.p7, pts.p5],
                [pts.p6, pts.p8, pts.p7],
                [pts.p8, pts.p9, pts.p7],
                [pts.p5, pts.p7, pts.p10],
                [pts.p5, pts.p10, pts.p12],
                [pts.p12, pts.p10, pts.p11]
            ];

            faces.forEach(triangle => {
                const geometry = new THREE.BufferGeometry();
                const vertices = new Float32Array([
                    triangle[0].x, triangle[0].y, triangle[0].z,
                    triangle[1].x, triangle[1].y, triangle[1].z,
                    triangle[2].x, triangle[2].y, triangle[2].z,
                ]);
                
                geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                geometry.computeVertexNormals();

                const faceGroup = new THREE.Group();

                const mesh = new THREE.Mesh(geometry, solidMaterial);
                const wire = new THREE.Mesh(geometry, wireMaterial);
                
                const meshBack = new THREE.Mesh(geometry, solidMaterial);
                meshBack.position.z = -0.2;
                const wireBack = new THREE.Mesh(geometry, wireMaterial);
                wireBack.position.z = -0.2;

                faceGroup.add(mesh);
                faceGroup.add(wire);
                faceGroup.add(meshBack);
                faceGroup.add(wireBack);

                const scatterDist = 40;
                faceGroup.position.set(
                    (Math.random() - 0.5) * scatterDist,
                    (Math.random() - 0.5) * scatterDist + 5,
                    (Math.random() - 0.5) * scatterDist
                );
                
                const randomEuler = new THREE.Euler(
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                );
                faceGroup.setRotationFromEuler(randomEuler);

                faceGroup.userData.initPos = faceGroup.position.clone();
                faceGroup.userData.initQuat = faceGroup.quaternion.clone();
                faceGroup.userData.targetPos = new THREE.Vector3(0, 0, 0);
                faceGroup.userData.targetQuat = new THREE.Quaternion().identity();

                faceGroup.userData.delay = Math.random() * 1500;

                window.birdParts.push(faceGroup);
                birdGroup.add(faceGroup);
            });

            birdGroup.position.set(0, 1, 0);
            scene.add(birdGroup);

            const particleGeometry = new THREE.BufferGeometry();
            const particleCount = isSmallOrTouch ? 350 : 1000;
            const posArray = new Float32Array(particleCount * 3);
            for(let i=0; i < particleCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 60;
            }
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particleMaterial = new THREE.PointsMaterial({
                size: 0.08,
                color: 0xffffff,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
            });
            particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particlesMesh);

            window.addEventListener('resize', onWindowResize, false);
            
            animate();
        }

        let isIntroActive = true;
        let introStartTime = Date.now();
        let targetCameraZ = 18;
        let initialCameraZ = 35;

        let settleStartTime = null;
        const SETTLE_DURATION = 7000;
        let isSettled = false;

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            try {
            if (particlesMesh) {
                particlesMesh.rotation.y += 0.0005;
                particlesMesh.rotation.x += 0.0002;
            }

            if (isIntroActive) {
                let elapsed = Date.now() - introStartTime;
                
                document.getElementById('hero-canvas-container').style.zIndex = '92';
                
                if (window.birdParts) {
                    window.birdParts.forEach(part => {
                        let partElapsed = Math.max(0, elapsed - part.userData.delay);
                        let partProgress = Math.min(partElapsed / 2500, 1);
                        let partEase = 1 - Math.pow(1 - partProgress, 4);
                        
                        part.position.lerpVectors(part.userData.initPos, part.userData.targetPos, partEase);
                        part.quaternion.slerpQuaternions(part.userData.initQuat, part.userData.targetQuat, partEase);
                    });
                }
                
                let camProgress = Math.min(elapsed / 6000, 1);
                let camEase = 1 - Math.pow(1 - camProgress, 3);
                camera.position.z = initialCameraZ - ((initialCameraZ - targetCameraZ) * camEase);

                let spinMultiplier = Math.max(0, 1 - (elapsed / 4000));
                birdGroup.rotation.y += 0.01 + (0.02 * spinMultiplier);
                birdGroup.rotation.x = 0.2 * spinMultiplier; 
                
                if (elapsed > 3000 && elapsed < 4000) {
                     const mottoText = document.getElementById('intro-motto');
                     if (mottoText && mottoText.style.opacity !== '1') {
                         mottoText.style.opacity = '1';
                         mottoText.style.transform = 'translateY(0)';
                     }
                }

                if (elapsed > 6500) {
                    isIntroActive = false;
                    settleStartTime = Date.now();
                    
                    const mottoText = document.getElementById('intro-motto');
                    const introBg = document.getElementById('intro-bg');
                    const heroContent = document.getElementById('hero-content');
                    
                    if (mottoText) {
                        mottoText.style.opacity = '0';
                        mottoText.style.transform = 'translateY(-20px)';
                        mottoText.style.transition = 'all 1.5s ease-in';
                    }
                    if (introBg) {
                        introBg.style.opacity = '0';
                    }
                    
                    if (heroContent) {
                        heroContent.style.opacity = '1';
                    }
                    
                    setTimeout(() => {
                        document.getElementById('hero-canvas-container').style.zIndex = '0';
                        if (introBg) introBg.remove();
                        const mottoContainer = document.getElementById('intro-motto-container');
                        if (mottoContainer) mottoContainer.remove();
                    }, 2000);
                }

            } else if (settleStartTime !== null && !isSettled) {
                let sElapsed = Date.now() - settleStartTime;
                let sProgress = Math.min(sElapsed / SETTLE_DURATION, 1);
                let sEase = 1 - Math.pow(1 - sProgress, 3);

                if (birdGroup) {
                    birdGroup.position.z = THREE.MathUtils.lerp(0, -6, sEase);
                    birdGroup.position.y = THREE.MathUtils.lerp(1, 3.4, sEase);
                    const s = THREE.MathUtils.lerp(1, 0.8, sEase);
                    birdGroup.scale.set(s, s, s);

                    const spinSpeed = THREE.MathUtils.lerp(0.006, 0.0016, sEase);
                    birdGroup.rotation.y += spinSpeed;
                    birdGroup.rotation.x = THREE.MathUtils.lerp(birdGroup.rotation.x, 0, 0.02);
                }

                camera.position.z = THREE.MathUtils.lerp(18, 19.5, sEase);

                if (window.__logoMaterials) {
                    const { solidMaterial, wireMaterial, solidBase, wireBase } = window.__logoMaterials;
                    solidMaterial.opacity = THREE.MathUtils.lerp(solidBase, 0.55, sEase);
                    wireMaterial.opacity = THREE.MathUtils.lerp(wireBase, 0.2, sEase);
                }

                if (sProgress >= 1) {
                    isSettled = true;
                }
            } else {
                if (birdGroup) {
                    birdGroup.rotation.y += 0.0016;
                    birdGroup.position.y = 3.4 + Math.sin(Date.now() * 0.00035) * 0.3;
                }
            }

            renderer.render(scene, camera);
            } catch (err) {
                
                console.warn('Intro animation hit an error, revealing the site instead of leaving it stuck.', err);
                isIntroActive = false;
                if (window.__forceRevealHero) window.__forceRevealHero();
            }
        }


        
