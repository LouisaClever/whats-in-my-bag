// Matter.js module aliases
        const Engine = Matter.Engine;
        const World = Matter.World;
        const Bodies = Matter.Bodies;
        const Body = Matter.Body;
        const Constraint = Matter.Constraint;
        const Mouse = Matter.Mouse;
        const MouseConstraint = Matter.MouseConstraint;
        const Vector = Matter.Vector;

        let engine;
        let world;
        let ground, leftWall, rightWall, ceiling;
        let items = [];
        let images = [];
        let mouseConstraint;
        let canvas;
        
        // Device orientation values
        let gravityX = 0;
        let gravityY = 1;
        let hasMotionPermission = false;
        let manualGravity = false;
        let permissionRequested = false;
        
        // Image scaling parameters
        const MAX_SIZE = 80;
        const MIN_SIZE = 40;

        function preload() {
            // Load placeholder images (you'll replace these with your actual images)
            for (let i = 1; i <= 12; i++) {
                images[i-1] = loadImage(`item${i}.png`);
            }
        }

        function setup() {
            canvas = createCanvas(windowWidth, windowHeight);
            
            // Create Matter.js engine
            engine = Engine.create();
            world = engine.world;
            
            // Reduce air friction for more realistic movement
            engine.world.gravity.scale = 0.001;
            
            // Create boundaries
            createBoundaries();
            
            // Create physics items
            createItems();
            
            // Setup mouse interaction
            setupMouseInteraction();
            
            // Setup permission system
            setupPermissionSystem();
        }
        
        function createBoundaries() {
            const thickness = 50;
            ground = Bodies.rectangle(width/2, height + thickness/2, width, thickness, {
                isStatic: true,
                render: { fillStyle: '#444' }
            });
            
            ceiling = Bodies.rectangle(width/2, -thickness/2, width, thickness, {
                isStatic: true,
                render: { fillStyle: '#444' }
            });
            
            leftWall = Bodies.rectangle(-thickness/2, height/2, thickness, height, {
                isStatic: true,
                render: { fillStyle: '#444' }
            });
            
            rightWall = Bodies.rectangle(width + thickness/2, height/2, thickness, height, {
                isStatic: true,
                render: { fillStyle: '#444' }
            });
            
            World.add(world, [ground, ceiling, leftWall, rightWall]);
        }
        
        function createItems() {
            for (let i = 0; i < images.length; i++) {
                let img = images[i];
                
                // Calculate responsive scale based on screen size
                // Base scale of 0.25, but adjust based on screen dimensions
                let baseScale = 0.25;
                let screenScale = min(windowWidth, windowHeight) / 1000; // Normalize to 1000px reference
                let scale = baseScale * screenScale;
                
                // Ensure minimum and maximum scale limits
                scale = constrain(scale, 0.25, 0.8);
                
                let scaledWidth = img.width * scale;
                let scaledHeight = img.height * scale;
                
                // Make physics body smaller than the visual image (0.8 = 80% of image size)
                const PHYSICS_SCALE = 0.8;
                let physicsWidth = scaledWidth * PHYSICS_SCALE;
                let physicsHeight = scaledHeight * PHYSICS_SCALE;
                
                // Random starting position
                let x = random(scaledWidth, width - scaledWidth);
                let y = random(scaledHeight, height/2);
                
                // Create physics body with smaller dimensions
                let body = Bodies.rectangle(x, y, physicsWidth, physicsHeight, {
                    restitution: 0.3,
                    friction: 0.5,
                    frictionAir: 0.01,
                    density: 0.001
                });
                
                // Store image and scale data with the body
                body.image = img;
                body.scaledWidth = scaledWidth;
                body.scaledHeight = scaledHeight;
                body.physicsWidth = physicsWidth;
                body.physicsHeight = physicsHeight;
                body.scale = scale;
                
                items.push(body);
                World.add(world, body);
            }
        }
        
        function setupPermissionSystem() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', setupPermissionSystem);
                return;
            }
            
            const controlModeSpan = document.getElementById('controlMode');
            
            // Check if element exists
            if (!controlModeSpan) {
                console.error('Control mode element not found');
                return;
            }
            
            // Check if device has orientation sensors
            const hasOrientationSensors = 'DeviceOrientationEvent' in window;
            
            if (!hasOrientationSensors) {
                // Desktop or device without sensors
                manualGravity = true;
                controlModeSpan.textContent = 'Use arrow keys for gravity';
                return;
            }
            
            // Check if we need to request permission (iOS 13+)
            const needsPermission = typeof DeviceOrientationEvent !== 'undefined' 
                && typeof DeviceOrientationEvent.requestPermission === 'function';
            
            if (!needsPermission) {
                // Android or older iOS - no permission needed
                hasMotionPermission = true;
                enableDeviceOrientation();
                controlModeSpan.textContent = 'Tilt device active';
                return;
            }
            
            // iOS 13+ - need user interaction to request permission
            controlModeSpan.textContent = 'Tap screen to enable motion';
            
            // Add click/touch listener to canvas
            canvas.canvas.addEventListener('click', requestMotionPermission);
            canvas.canvas.addEventListener('touchstart', requestMotionPermission);
        }
        
        async function requestMotionPermission() {
            if (permissionRequested) return;
            permissionRequested = true;
            
            const controlModeSpan = document.getElementById('controlMode');
            
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                
                if (permission === 'granted') {
                    hasMotionPermission = true;
                    enableDeviceOrientation();
                    controlModeSpan.textContent = 'Motion sensors enabled';
                    
                    // Remove event listeners
                    canvas.canvas.removeEventListener('click', requestMotionPermission);
                    canvas.canvas.removeEventListener('touchstart', requestMotionPermission);
                } else {
                    manualGravity = true;
                    controlModeSpan.textContent = 'Motion denied - use arrow keys';
                }
            } catch (error) {
                console.error('Error requesting permission:', error);
                manualGravity = true;
                controlModeSpan.textContent = 'Motion error - use arrow keys';
            }
        }
        
        function enableDeviceOrientation() {
            window.addEventListener('deviceorientation', handleOrientation);
            console.log('Device orientation enabled');
        }
        
        function setupMouseInteraction() {
            // Create mouse constraint for dragging
            let mouse = Mouse.create(canvas.canvas);
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
            
            World.add(world, mouseConstraint);
            
            // Keep the mouse in sync with rendering if the canvas moves
            mouse.pixelRatio = pixelDensity();
        }
        
        function handleOrientation(event) {
            if (!hasMotionPermission) return;
            
            // Get device orientation values
            let beta = event.beta;   // front/back tilt (-180 to 180)
            let gamma = event.gamma; // left/right tilt (-90 to 90)
            
            if (beta !== null && gamma !== null) {
                // Convert tilt to gravity direction
                gravityX = gamma / 90;  // Normalize to -1 to 1
                gravityY = beta / 90;   // Normalize to -1 to 1
                
                // Clamp values
                gravityX = constrain(gravityX, -1, 1);
                gravityY = constrain(gravityY, -1, 1);
                
                // Apply to physics engine
                engine.world.gravity.x = gravityX;
                engine.world.gravity.y = gravityY;
            }
        }
        
        function draw() {
            background(240);
            
            // Update physics engine
            Engine.update(engine);
            
            // Draw all items
            for (let item of items) {
                push();
                translate(item.position.x, item.position.y);
                rotate(item.angle);
                
                // Draw image centered
                imageMode(CENTER);
                image(item.image, 0, 0, item.scaledWidth, item.scaledHeight);
                
                pop();
            }
            
            // Draw boundaries (optional, for debugging)
            //drawBoundaries();
            
            // Show gravity direction indicator
            //drawGravityIndicator();
        }
        
        function drawBoundaries() {
            fill(68);
            noStroke();
            
            // Ground
            rect(0, height - 25, width, 50);
            // Ceiling
            rect(0, -25, width, 50);
            // Left wall
            rect(-25, 0, 50, height);
            // Right wall
            rect(width - 25, 0, 50, height);
        }
        
        function drawGravityIndicator() {
            push();
            translate(width - 50, 50);
            
            // Draw circle
            stroke(255);
            strokeWeight(2);
            noFill();
            circle(0, 0, 30);
            
            // Draw gravity direction arrow
            stroke(255, 100, 100);
            strokeWeight(3);
            let arrowX = gravityX * 12;
            let arrowY = gravityY * 12;
            line(0, 0, arrowX, arrowY);
            
            // Arrow head
            push();
            translate(arrowX, arrowY);
            rotate(atan2(arrowY, arrowX));
            line(0, 0, -5, -2);
            line(0, 0, -5, 2);
            pop();
            
            // Show control mode
            fill(255);
            noStroke();
            textAlign(CENTER);
            textSize(10);
            if (manualGravity) {
                text("Manual", 0, 45);
                text("Use arrows", 0, 55);
            } else if (hasMotionPermission) {
                text("Motion", 0, 45);
            } else {
                text("Static", 0, 45);
            }
            
            pop();
        }
        
        function touchStarted() {
            // Handle touch events for mobile
            return false;
        }
        
        function touchMoved() {
            // Handle touch drag
            return false;
        }
        
        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
            
            // Remove old boundaries
            World.remove(world, [ground, ceiling, leftWall, rightWall]);
            
            // Create new boundaries
            createBoundaries();
            
            // Update item scales for new screen size
            updateItemScales();
        }
        
        function updateItemScales() {
            for (let item of items) {
                // Recalculate responsive scale
                let baseScale = 0.25;
                let screenScale = min(windowWidth, windowHeight) / 1000;
                let newScale = constrain(baseScale * screenScale, 0.1, 0.5);
                
                // Calculate new dimensions
                let newScaledWidth = item.image.width * newScale;
                let newScaledHeight = item.image.height * newScale;
                
                // Update physics body size
                const PHYSICS_SCALE = 0.8;
                let newPhysicsWidth = newScaledWidth * PHYSICS_SCALE;
                let newPhysicsHeight = newScaledHeight * PHYSICS_SCALE;
                
                // Scale the physics body
                Body.scale(item, 
                    newPhysicsWidth / item.physicsWidth, 
                    newPhysicsHeight / item.physicsHeight
                );
                
                // Update stored dimensions
                item.scaledWidth = newScaledWidth;
                item.scaledHeight = newScaledHeight;
                item.physicsWidth = newPhysicsWidth;
                item.physicsHeight = newPhysicsHeight;
                item.scale = newScale;
            }
        }
        
        function keyPressed() {
            if (key === 'r' || key === 'R') {
                // Reset simulation
                for (let item of items) {
                    Body.setPosition(item, {
                        x: random(item.scaledWidth, width - item.scaledWidth),
                        y: random(item.scaledHeight, height/2)
                    });
                    Body.setVelocity(item, { x: 0, y: 0 });
                    Body.setAngularVelocity(item, 0);
                }
            }
            
            // Manual gravity controls (when motion sensors not available)
            if (manualGravity) {
                if (keyCode === LEFT_ARROW) {
                    gravityX = -0.5;
                    engine.world.gravity.x = gravityX;
                }
                if (keyCode === RIGHT_ARROW) {
                    gravityX = 0.5;
                    engine.world.gravity.x = gravityX;
                }
                if (keyCode === UP_ARROW) {
                    gravityY = -0.5;
                    engine.world.gravity.y = gravityY;
                }
                if (keyCode === DOWN_ARROW) {
                    gravityY = 0.5;
                    engine.world.gravity.y = gravityY;
                }
                if (key === ' ') {
                    // Reset gravity to center
                    gravityX = 0;
                    gravityY = 1;
                    engine.world.gravity.x = gravityX;
                    engine.world.gravity.y = gravityY;
                }
            }
        }
