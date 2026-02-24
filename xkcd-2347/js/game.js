(function () {
  'use strict';

  var Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Sleeping = Matter.Sleeping;

  var canvas = document.getElementById('game-canvas');
  var ctx = canvas.getContext('2d');
  var rc = rough.canvas(canvas);

  var WIDTH = 800;
  var HEIGHT = 700;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  var GROUND_TOP = HEIGHT - 20;
  var cx = WIDTH / 2;

  // ── Hand-crafted tower matching the comic shape ──
  // Each block: [x_center, y_bottom_offset_from_ground_top, w, h, flags]
  // We place blocks bottom-up. y is measured as distance above ground top.
  // This way we can stack precisely: next row's y = previous row's y + previous row's h.

  function buildTowerDefs() {
    var defs = [];

    function add(x, yAboveGround, w, h, flags) {
      defs.push({
        x: cx + x,
        y: GROUND_TOP - yAboveGround - h / 2,
        w: w, h: h,
        isNebraska: false
      });
    }

    // === PEDESTAL (wide base) ===

    // Layer 0: big wide slab
    add(0, 0, 300, 20);

    // Layer 1: two wide slabs
    add(-75, 20, 150, 18);
    add(75, 20, 150, 18);

    // Layer 2: big block + two smaller
    add(-50, 38, 180, 26);
    add(60, 38, 60, 26);

    // Row 3: three blocks
    add(-56, 64, 88, 26);
    add(0, 64, 24, 26);
    add(56, 64, 88, 26);

    // === MAIN COLUMN ===

    // Row 4: massive wide block
    add(0, 90, 200, 22);

    // Row 5: three blocks
    add(-60, 112, 80, 28);     // -100 to -20
    add(20, 112, 60, 20);      // -10 to 50 (overlaps slightly, friction holds)
    add(70, 112, 50, 20);      // 45 to 95

    // Row 6: one big wide block
    add(0, 140, 180, 24);

    // Row 7: varied
    add(-55, 164, 40, 34);     // tall narrow: -75 to -35
    add(-5, 164, 60, 22);      // -35 to 25
    add(50, 164, 50, 22);      // 25 to 75

    // Row 8: wide block
    add(0, 198, 160, 18);

    // Row 9: four blocks
    add(-55, 216, 50, 24);     // -80 to -30
    add(-10, 216, 40, 24);     // -30 to 10
    add(30, 216, 40, 20);      // 10 to 50
    add(65, 216, 30, 18);      // 50 to 80

    // Row 10: big wide block
    add(0, 240, 140, 18);

    // Row 11: two blocks
    add(-35, 258, 70, 22);     // -70 to 0
    add(35, 258, 70, 22);      // 0 to 70

    // Row 12: wide
    add(0, 280, 120, 18);

    // Row 13: narrowing
    add(-20, 298, 60, 16);
    add(30, 298, 40, 16);

    // === TOP SPIRES ===

    // Left spire
    add(-25, 314, 35, 24);
    add(-25, 338, 22, 20);
    add(-25, 358, 14, 30);

    // Center spire
    add(10, 314, 30, 20);
    add(10, 334, 24, 24);
    add(10, 358, 16, 20);
    add(10, 378, 10, 16);

    // Right spire
    add(40, 314, 26, 28);
    add(40, 342, 18, 22);

    // Tiny top bits
    add(-25, 388, 10, 14);
    add(10, 394, 8, 12);
    add(40, 364, 12, 14);

    return defs;
  }

  var BLOCK_DEFS = buildTowerDefs();

  var engine, world, mouseConstraint;
  var blocks = [];
  var animFrameId = null;

  function init() {
    engine = Engine.create({ enableSleeping: true });
    world = engine.world;
    engine.gravity.y = 1;

    var ground = Bodies.rectangle(WIDTH / 2, HEIGHT - 10, WIDTH + 100, 20, {
      isStatic: true, friction: 1.0
    });
    World.add(world, ground);

    blocks = [];
    BLOCK_DEFS.forEach(function (def) {
      var body = Bodies.rectangle(def.x, def.y, def.w, def.h, {
        friction: 0.9,
        frictionStatic: 2.0,
        restitution: 0.0,
        density: 0.004,
        sleepThreshold: 20
      });
      World.add(world, body);
      blocks.push({
        body: body, w: def.w, h: def.h,
        isNebraska: def.isNebraska, seed: body.id
      });
    });

    var mouse = Mouse.create(canvas);
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.6, damping: 0.1, render: { visible: false } }
    });
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    World.add(world, mouseConstraint);

    // Wake all blocks when dragging starts so they react to removed support
    Matter.Events.on(mouseConstraint, 'startdrag', function () {
      blocks.forEach(function (b) {
        Sleeping.set(b.body, false);
      });
    });

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(gameLoop);
  }

  function gameLoop() {
    Engine.update(engine, 1000 / 60);
    draw();
    animFrameId = requestAnimationFrame(gameLoop);
  }

  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Ground
    rc.rectangle(0, HEIGHT - 20, WIDTH, 20, {
      fill: '#f5f5f5', fillStyle: 'solid',
      stroke: '#333', strokeWidth: 1.5, roughness: 1, seed: 9999
    });

    // Blocks
    blocks.forEach(function (b) {
      ctx.save();
      ctx.translate(b.body.position.x, b.body.position.y);
      ctx.rotate(b.body.angle);
      rc.rectangle(-b.w / 2, -b.h / 2, b.w, b.h, {
        fill: b.isNebraska ? '#fffde0' : '#fff',
        fillStyle: 'solid',
        stroke: '#333',
        strokeWidth: b.isNebraska ? 2.5 : 1.5,
        roughness: 1.2,
        seed: b.seed
      });
      ctx.restore();
    });
  }

  init();
})();
