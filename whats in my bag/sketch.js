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
            
            // Request device orientation permission (for iOS 13+)
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission();
            }
            
            // Listen for device orientation changes
            window.addEventListener('deviceorientation', handleOrientation);
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
                
                // Calculate scaled dimensions maintaining aspect ratio
                //let scale = random(MIN_SIZE, MAX_SIZE) / max(img.width, img.height);
                let scale = 0.25;
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
        }