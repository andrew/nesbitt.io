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

  var isMobile, WIDTH, HEIGHT, GROUND_TOP, cx;

  function updateDimensions() {
    isMobile = window.innerWidth < 600;
    WIDTH = isMobile ? 400 : 800;
    HEIGHT = 700;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    GROUND_TOP = HEIGHT - 20;
    cx = WIDTH / 2;
    rc = rough.canvas(canvas);
  }
  updateDimensions();

  // Seeded PRNG so each reload gives a different tower
  var seed = Math.floor(Math.random() * 2147483646) + 1;
  function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  function randRange(min, max) {
    return min + rand() * (max - min);
  }
  function randInt(min, max) {
    return Math.floor(randRange(min, max + 1));
  }

  // ── Randomized tower builder ──
  //
  // Builds bottom-up. Each row:
  //  - Has a defined width (starts wide, narrows toward top)
  //  - Gets filled left-to-right with random-width blocks, edge-to-edge
  //  - Row height is random within a range
  //  - Small gaps between some blocks
  //  - Block widths shrink as we go up

  function buildTowerDefs() {
    var defs = [];
    var y = 0; // distance above ground top, increases upward

    // Easter egg: single massive block
    if (rand() < 0.001) {
      var w = isMobile ? randRange(100, 180) : randRange(200, 300);
      var h = isMobile ? randRange(200, 400) : randRange(300, 500);
      defs.push({
        x: cx,
        y: GROUND_TOP - h / 2,
        w: w,
        h: h,
        forceLabel: 'sqlite'
      });
      return defs;
    }

    // Small chance of a "monolith" tower -- few huge blocks
    var monolith = rand() < 0.1;

    // Tower parameters
    var baseWidth = monolith ? randRange(200, 260) : randRange(280, 340);
    if (isMobile) baseWidth *= 0.4;
    var numRows = monolith ? randInt(4, 7) : randInt(16, 22);
    // Track tall blocks that span multiple rows so we don't overlap them
    var tallBlocks = []; // { left, right, topY } -- topY is how high they extend

    for (var r = 0; r < numRows; r++) {
      // Columnar taper: stays wide for bottom 60%, narrows faster near top
      var t = r / numRows;
      var shrink;
      if (t < 0.6) {
        shrink = t * 0.25;
      } else {
        shrink = 0.15 + (t - 0.6) * 1.7;
      }
      // Add random jitter to row width so it's not a smooth curve
      var rowWidth = baseWidth * (1 - shrink) + randRange(-15, 15);
      if (rowWidth < 30) break;

      // Vary row heights
      var rowH;
      if (monolith) {
        rowH = randRange(50, 120);
      } else if (r < 3) {
        rowH = randRange(16, 30);
      } else if (rand() < 0.2) {
        rowH = randRange(8, 14);
      } else {
        rowH = randRange(14, 28);
      }

      var maxBlockW = Math.min(rowWidth, randRange(50, 180));
      if (monolith) maxBlockW = rowWidth;
      if (r > numRows * 0.6) maxBlockW = Math.min(rowWidth, randRange(25, 80));
      var minBlockW = monolith ? Math.min(60, rowWidth) : Math.min(18, rowWidth);

      // Big massive blocks
      if (r > 1 && r < numRows - 4 && rand() < 0.2) {
        var bigW = Math.round(rowWidth * randRange(0.5, 0.85));
        var bigH = Math.round(randRange(60, 120));
        var maxOffset = (rowWidth - bigW) / 4; // keep big blocks near center
        var bigX = randRange(-maxOffset, maxOffset);
        defs.push({
          x: cx + bigX,
          y: GROUND_TOP - y - bigH / 2,
          w: bigW,
          h: bigH
        });
        tallBlocks.push({ left: -bigW / 2 + bigX, right: bigW / 2 + bigX, topY: y + bigH });
        y += bigH;
        continue;
      }

      var rowLeft = -rowWidth / 2;
      var rowRight = rowWidth / 2;
      var x = rowLeft;

      // Remove expired tall blocks (ones that don't reach this row)
      tallBlocks = tallBlocks.filter(function (tb) { return tb.topY > y; });

      // Sometimes skip a chunk at the start (indent from left)
      if (r > 4 && rand() < 0.15) {
        x += randRange(5, 15);
      }

      while (x < rowRight - 5) {
        var remaining = rowRight - x;

        // Check if a tall block from a previous row occupies this x range
        var blocked = false;
        for (var t = 0; t < tallBlocks.length; t++) {
          var tb = tallBlocks[t];
          if (x + minBlockW > tb.left && x < tb.right) {
            // Skip past this tall block
            x = tb.right;
            blocked = true;
            break;
          }
        }
        if (blocked) continue;

        // Gaps between blocks
        if (x > rowLeft && rand() < 0.25) {
          var gap = randRange(2, 8);
          x += gap;
          remaining = rowRight - x;
          if (remaining < minBlockW) break;
        }

        // Sometimes skip the rest of the row (leave right side empty)
        if (x > rowLeft + 60 && rand() < 0.08) break;

        remaining = rowRight - x;

        // Pick block width
        var w;
        if (remaining <= maxBlockW) {
          w = remaining;
        } else {
          w = randRange(minBlockW, Math.min(maxBlockW, remaining));
          if (rowRight - (x + w) < minBlockW) w = remaining;
        }
        w = Math.round(w);
        if (w < 8) break;

        // Decide block height -- sometimes make a tall block spanning 2-3 rows
        var h = rowH;
        if (r > 1 && r < numRows - 3 && w < 40 && rand() < 0.2) {
          // Tall block: 1.5-3x the row height
          h = Math.round(rowH * randRange(1.5, 3));
          tallBlocks.push({ left: x, right: x + w, topY: y + h });
        }

        defs.push({
          x: cx + x + w / 2,
          y: GROUND_TOP - y - h / 2,
          w: w,
          h: h
        });

        x += w;
      }

      // Cantilever: long thin block that sticks out one side
      if (r > 5 && rand() < 0.12) {
        var cantW = Math.round(randRange(50, 90));
        var cantH = Math.round(randRange(8, 14));
        var side = rand() < 0.5 ? -1 : 1;
        // ~15% hangs off the edge, 85% supported
        var cantX = side * (rowWidth / 2 - cantW * 0.35);
        defs.push({
          x: cx + cantX,
          y: GROUND_TOP - y - cantH / 2,
          w: cantW,
          h: cantH
        });
      }

      y += rowH;
    }

    return defs;
  }

  // ── Fake project name generator ──

  var prefixes = [
    'lib', 'node-', 'py', 'go-', 'rust-', 'open', 'fast', 'micro', 'nano',
    'super-', 'hyper-', 'ultra-', 'mini-', 'core-', 'base-', 'net-', 're-',
    'un', 'de-', 'multi-', 'omni-', 'proto-', 'meta-'
  ];

  var roots = [
    'sock', 'parse', 'flux', 'sync', 'cache', 'queue', 'crypt', 'hash',
    'buf', 'stream', 'pipe', 'mux', 'codec', 'glob', 'fetch', 'lint',
    'bind', 'wrap', 'shim', 'hook', 'yaml', 'json', 'csv', 'xml',
    'http', 'smtp', 'dns', 'tcp', 'ssh', 'tls', 'auth', 'oauth',
    'log', 'config', 'env', 'path', 'time', 'date', 'math', 'rand',
    'zip', 'tar', 'gzip', 'snappy', 'lz4', 'zstd',
    'pixel', 'font', 'color', 'image', 'chart', 'table',
    'daemon', 'worker', 'sched', 'pool', 'spawn', 'fork'
  ];

  var suffixes = [
    '.js', '.py', '-rs', '-go', '-core', '-utils', '-lite', '-ng',
    '-x', '-2', '2', '3', '-plus', '-pro', '-next', '-dev',
    'ify', 'er', 'ly', 'io', 'kit', 'lab', 'hub', 'box',
    '-compat', '-extra', '-mini', '-fast', ''
  ];

  var usernames = [
    'xXDarkCoderXx', 'jeff42', 'the_real_dev', 'codemonkey99',
    'sysadmin_karen', 'linuxfan1987', 'gregtech', 'dev-null',
    'random_contrib', '0xDEADBEEF', 'patches_welcome', 'bus-factor-1',
    'unmaintained', 'mass_master', 'gary_nebraska', 'lone_mass'
  ];

  var domains = [
    'github.com', 'gitlab.com', 'codeberg.org', 'sourceforge.net'
  ];

  var jsPrefixes = [
    'node-', 'next-', 'express-', 'react-', 'vue-', 'webpack-',
    'babel-', 'eslint-', 'npm-', 'yarn-', '@left-pad/', '@is-odd/'
  ];

  var jsSuffixes = [
    '.js', '.js', '.js', '.mjs', '-webpack-plugin', '-loader',
    '-transform', '-polyfill', '-shim', '-compat'
  ];

  function generateProjectName(settleMs) {
    // Longer settle time = more likely to be a JS project
    var jsChance = Math.min(0.9, settleMs / 4000);

    var name = '';
    if (rand() < jsChance) {
      // JS-flavored name
      if (rand() < 0.5) name += jsPrefixes[randInt(0, jsPrefixes.length - 1)];
      name += roots[randInt(0, roots.length - 1)];
      name += jsSuffixes[randInt(0, jsSuffixes.length - 1)];
    } else {
      if (rand() < 0.6) name += prefixes[randInt(0, prefixes.length - 1)];
      name += roots[randInt(0, roots.length - 1)];
      if (rand() < 0.7) name += suffixes[randInt(0, suffixes.length - 1)];
    }

    if (rand() < 0.35) {
      var domain = domains[randInt(0, domains.length - 1)];
      var user = usernames[randInt(0, usernames.length - 1)];
      return domain + '/' + user + '/' + name;
    }

    return name;
  }

  // ── Game state ──

  var engine, world, mouseConstraint;
  var blocks = [];
  var animFrameId = null;
  var settled = false;
  var projectName = '';
  var initTime = 0;

  // Create mouse once, reuse across restarts
  var mouse = Mouse.create(canvas);
  mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
  mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

  function updateMouseScale() {
    var rect = canvas.getBoundingClientRect();
    Mouse.setScale(mouse, {
      x: WIDTH / rect.width,
      y: HEIGHT / rect.height
    });
  }
  updateMouseScale();
  window.addEventListener('resize', updateMouseScale);

  function init() {
    engine = Engine.create({ enableSleeping: true });
    world = engine.world;
    engine.gravity.y = 1;

    var ground = Bodies.rectangle(WIDTH / 2, HEIGHT - 10, WIDTH + 100, 20, {
      isStatic: true, friction: 1.0
    });
    World.add(world, ground);

    var defs = buildTowerDefs();
    blocks = [];
    defs.forEach(function (def) {
      var body = Bodies.rectangle(def.x, def.y, def.w, def.h, {
        friction: 1.0,
        frictionStatic: 3.0,
        restitution: 0.0,
        density: 0.001,
        sleepThreshold: 20
      });
      World.add(world, body);
      var shade = Math.floor(randRange(210, 255));
      var fill = 'rgb(' + shade + ',' + shade + ',' + shade + ')';
      blocks.push({ body: body, w: def.w, h: def.h, seed: body.id, fill: fill, forceLabel: def.forceLabel || null });
    });

    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.6, damping: 0.1, render: { visible: false } }
    });
    World.add(world, mouseConstraint);

    Matter.Events.on(mouseConstraint, 'startdrag', function () {
      blocks.forEach(function (b) {
        Sleeping.set(b.body, false);
      });
    });

    updateMouseScale();

    settled = false;
    projectName = '';
    initTime = Date.now();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(gameLoop);
  }

  function gameLoop() {
    Engine.update(engine, 1000 / 60);

    if (!settled) {
      var allSleeping = blocks.every(function (b) { return b.body.isSleeping; });
      var timedOut = Date.now() - initTime > 3000;
      if (allSleeping || timedOut) {
        settled = true;
        var forcedLabel = null;
        blocks.forEach(function (b) { if (b.forceLabel) forcedLabel = b.forceLabel; });
        projectName = forcedLabel || generateProjectName(Date.now() - initTime);
      }
    }

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
        fill: b.fill,
        fillStyle: 'solid',
        stroke: '#333',
        strokeWidth: 1.5,
        roughness: 1.2,
        seed: b.seed
      });
      ctx.restore();
    });

    // Show project name once settled
    if (settled && projectName) {
      var FONT = "'xkcd-script', 'Comic Sans MS', 'Bradley Hand', 'Comic Neue', cursive";
      ctx.font = (isMobile ? '15px ' : '32px ') + FONT;
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(projectName, cx, 20);
    }
  }

  function restart() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (engine) {
      World.clear(world);
      Matter.Engine.clear(engine);
    }
    seed = Math.floor(Math.random() * 2147483646) + 1;
    updateDimensions();
    init();
  }

  document.getElementById('refresh-btn').addEventListener('click', restart);

  document.getElementById('info-btn').addEventListener('click', function () {
    document.getElementById('info-panel').classList.toggle('hidden');
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    var wasMobile = isMobile;
    var nowMobile = window.innerWidth < 600;
    if (wasMobile !== nowMobile) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(restart, 200);
    }
  });

  init();
})();
