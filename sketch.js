// Matter.js module aliases
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine;
let world;
let ground, leftWall, rightWall, ceiling;
let items = [];
let images = [];
let mouseConstraint;
let canvas;

let button;

let gravityX = 0;
let gravityY = 1;

function preload() {
    // Lade die 12 Bilder aus dem lokalen Ordner (z. B. item1.png bis item12.png)
    for (let i = 1; i <= 12; i++) {
        images[i - 1] = loadImage(`item${i}.png`);
    }
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    engine = Engine.create();
    world = engine.world;

    // Sanftere globale Schwerkraft-Skalierung (wir regeln die Richtung separat)
    engine.world.gravity.scale = 0.0005;

    createBoundaries();
    createItems();
    setupMouseInteraction();

    button = createButton('Bewegung aktivieren');
    button.position(width / 2 - 80, height / 2 - 20);
    button.style('font-size', '18px');
    button.style('padding', '10px 20px');
    button.style('background', '#ffffff');
    button.style('color', '#000000');
    button.style('border', 'none');
    button.style('border-radius', '5px');
    button.style('z-index', '1000');
    button.mousePressed(requestAccess);
}

function requestAccess() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    button.hide();
                    window.addEventListener('deviceorientation', handleOrientation);
                } else {
                    alert('Bewegungserlaubnis wurde abgelehnt.');
                }
            })
            .catch(err => {
                console.error('Fehler bei requestPermission:', err);
            });
    } else {
        button.hide();
        window.addEventListener('deviceorientation', handleOrientation);
    }
}

function createBoundaries() {
    const thickness = 50;
    ground = Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true });
    ceiling = Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true });
    leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true });
    rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true });
    World.add(world, [ground, ceiling, leftWall, rightWall]);
}

function createItems() {
    for (let i = 0; i < images.length; i++) {
        let img = images[i];
        let scale = 0.25;
        let scaledWidth = img.width * scale;
        let scaledHeight = img.height * scale;

        const PHYSICS_SCALE = 0.8;
        let physicsWidth = scaledWidth * PHYSICS_SCALE;
        let physicsHeight = scaledHeight * PHYSICS_SCALE;

        let x = random(scaledWidth, width - scaledWidth);
        let y = random(scaledHeight, height / 2);

        let body = Bodies.rectangle(x, y, physicsWidth, physicsHeight, {
            restitution: 0.3,
            friction: 0.5,
            frictionAir: 0.01,
            density: 0.001
        });

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
    let mouse = Mouse.create(canvas.canvas);
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    World.add(world, mouseConstraint);
    mouse.pixelRatio = pixelDensity();
}

function handleOrientation(event) {
    let beta = event.beta;
    let gamma = event.gamma;

    if (beta !== null && gamma !== null) {
        let gX = gamma / 90;
        let gY = (beta > 90) ? (beta - 180) / 90 : beta / 90;

        gravityX = constrain(gX, -1, 1);
        gravityY = constrain(gY, -1, 1);

        const GRAVITY_MULTIPLIER = 1.5; // 🟢 Jetzt fallen die Items schneller!
        engine.world.gravity.x = gravityX * GRAVITY_MULTIPLIER;
        engine.world.gravity.y = gravityY * GRAVITY_MULTIPLIER;
    }
}

function draw() {
    background(240);

    if (!window.DeviceOrientationEvent || !window.DeviceOrientationEvent.requestPermission) {
        engine.world.gravity.x = 0;
        engine.world.gravity.y = 1;
    }

    Engine.update(engine);

    for (let item of items) {
        push();
        translate(item.position.x, item.position.y);
        rotate(item.angle);
        imageMode(CENTER);
        image(item.image, 0, 0, item.scaledWidth, item.scaledHeight);
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    World.remove(world, [ground, ceiling, leftWall, rightWall]);
    createBoundaries();
}

function keyPressed() {
    if (key === 'r' || key === 'R') {
        for (let item of items) {
            Body.setPosition(item, {
                x: random(item.scaledWidth, width - item.scaledWidth),
                y: random(item.scaledHeight, height / 2)
            });
            Body.setVelocity(item, { x: 0, y: 0 });
            Body.setAngularVelocity(item, 0);
        }
    }
}
