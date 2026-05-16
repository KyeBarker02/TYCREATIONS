/**
 * TY Creations — Honeybee Animation
 *
 * Desktop (≥768px): Bee travels horizontally across the top navbar on scroll.
 *   Two elliptical loop-the-loops with dramatic wave arcs between them.
 *
 * Mobile (<768px): Bee travels vertically down the right edge on scroll.
 *   Same loop-the-loop + wave structure, rotated 90° — loops extend leftward.
 *
 * HOW TO USE: Add inside your HTML <body> (after other scripts):
 *   <script src="bee_script.js"></script>
 */
(function () {
    'use strict';

    const MOBILE_BREAKPOINT = 768;

    // ── CONFIGURATION ─────────────────────────────────────────────────────
    const CFG = {
        // Desktop
        navY:        94,
        startMargin: 80,
        endMargin:   100,
        // Mobile
        navXOffset:  28,   // px from the right edge
        startMarginY: 80,
        endMarginY:   20,  // reduced so path reaches near the bottom of the screen
        // Shared
        beeW:        58,
        beeH:        36,
        scrollCap:   0.99,
        pathSamples: 600,
    };

    // ── DESKTOP SEGMENTS (horizontal path) ───────────────────────────────
    const SEGS_H = [
        { t0: 0.00, t1: 0.12, type: 'wave', waveH: 20, cycles: 1 },
        { t0: 0.12, t1: 0.46, type: 'loop', rx: 52, ry: 34 },
        { t0: 0.46, t1: 0.60, type: 'wave', waveH: 26, cycles: 2 },
        { t0: 0.60, t1: 0.78, type: 'loop', rx: 26, ry: 17 },
        { t0: 0.78, t1: 1.00, type: 'wave', waveH: 20, cycles: 1 },
    ];

    // ── MOBILE SEGMENTS (vertical path, single loop bulging leftward) ────
    // Large loop removed — only the smaller loop (rx:14, ry:22) remains.
    // 3 segments: entry wave → single loop → exit wave to bottom of screen.
    const SEGS_V = [
        { t0: 0.00, t1: 0.18, type: 'wave', waveH: 18, cycles: 1 },
        { t0: 0.18, t1: 0.52, type: 'loop', rx: 14, ry: 22 },
        { t0: 0.52, t1: 1.00, type: 'wave', waveH: 18, cycles: 1 },
    ];

    // ── DASHED TRAIL SVG ──────────────────────────────────────────────────
    const ns = 'http://www.w3.org/2000/svg';

    const trailSvg = document.createElementNS(ns, 'svg');
    trailSvg.id = 'ty-bee-trail';
    Object.assign(trailSvg.style, {
        position:      'fixed',
        top:           '0',
        left:          '0',
        width:         '100%',
        height:        '100%',
        zIndex:        '101',
        pointerEvents: 'none',
        overflow:      'visible',
    });

    const trailPath = document.createElementNS(ns, 'path');
    trailPath.setAttribute('fill',             'none');
    trailPath.setAttribute('stroke',           '#5a7a5e');
    trailPath.setAttribute('stroke-width',     '1.4');
    trailPath.setAttribute('stroke-dasharray', '4 8');
    trailPath.setAttribute('stroke-linecap',   'round');
    trailPath.setAttribute('opacity',          '0.38');
    trailSvg.appendChild(trailPath);
    document.body.appendChild(trailSvg);

    // ── BEE ELEMENT ───────────────────────────────────────────────────────
    const bee = document.createElement('div');
    bee.id = 'ty-bee';
    Object.assign(bee.style, {
        position:        'fixed',
        top:             '0',
        left:            '0',
        width:           CFG.beeW + 'px',
        height:          CFG.beeH + 'px',
        zIndex:          '102',
        pointerEvents:   'none',
        willChange:      'transform',
        transformOrigin: '50% 50%',
        filter:          'drop-shadow(0 2px 5px rgba(0,0,0,0.18))',
        lineHeight:      '0',
    });

    // Wings have IDs so JS can animate their ry attribute directly.
    // All four wings flap — front pair beats slightly out of phase with rear pair.
    bee.innerHTML = `
    <svg viewBox="-58 -42 100 84" xmlns="http://www.w3.org/2000/svg"
         width="${CFG.beeW}" height="${CFG.beeH}" aria-hidden="true">
      <defs>
        <radialGradient id="bg3" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stop-color="#f5cf3f"/>
          <stop offset="100%" stop-color="#d4a817"/>
        </radialGradient>
        <radialGradient id="wg3" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="rgba(220,240,220,0.85)"/>
          <stop offset="100%" stop-color="rgba(168,197,160,0.50)"/>
        </radialGradient>
      </defs>

      <g transform="rotate(90)">

        <!-- Front wings (top pair) — animated via ry -->
        <ellipse id="ty-w-fl" cx="-22" cy="-6"  rx="20" ry="13" fill="url(#wg3)" stroke="#a8c5a0" stroke-width="1"/>
        <ellipse id="ty-w-fr" cx=" 22" cy="-6"  rx="20" ry="13" fill="url(#wg3)" stroke="#a8c5a0" stroke-width="1"/>

        <!-- Rear wings (bottom pair) — animated via ry, slight phase offset -->
        <ellipse id="ty-w-rl" cx="-20" cy=" 12" rx="16" ry="10" fill="url(#wg3)" stroke="#a8c5a0" stroke-width="0.8" opacity="0.85"/>
        <ellipse id="ty-w-rr" cx=" 20" cy=" 12" rx="16" ry="10" fill="url(#wg3)" stroke="#a8c5a0" stroke-width="0.8" opacity="0.85"/>

        <!-- Wing venation -->
        <line x1="-22" y1="-17" x2="-22" y2="4" stroke="#7a9e7e" stroke-width="0.6" opacity="0.4"/>
        <line x1=" 22" y1="-17" x2=" 22" y2="4" stroke="#7a9e7e" stroke-width="0.6" opacity="0.4"/>

        <!-- Abdomen -->
        <ellipse cx="0" cy="10" rx="15" ry="20" fill="url(#bg3)" stroke="#b8920f" stroke-width="0.8"/>
        <rect x="-14" y="1"  width="28" height="6" rx="3"   fill="#1a1a1a" opacity="0.45"/>
        <rect x="-13" y="12" width="26" height="6" rx="3"   fill="#1a1a1a" opacity="0.45"/>
        <rect x="-10" y="22" width="20" height="5" rx="2.5" fill="#1a1a1a" opacity="0.35"/>
        <ellipse cx="0" cy="31" rx="3.5" ry="2.5" fill="#9a7a0a" opacity="0.65"/>

        <!-- Thorax -->
        <ellipse cx="0" cy="-8" rx="10" ry="9" fill="#2d2d1a" opacity="0.82"/>

        <!-- Head -->
        <circle cx="0" cy="-22" r="11" fill="#e8ba2a" stroke="#b8920f" stroke-width="0.8"/>
        <ellipse cx="-7.5" cy="-23.5" rx="4"   ry="3.5" fill="#111" opacity="0.9"/>
        <ellipse cx=" 7.5" cy="-23.5" rx="4"   ry="3.5" fill="#111" opacity="0.9"/>
        <circle  cx="-6.5" cy="-24.8" r="1.2"           fill="#fff" opacity="0.6"/>
        <circle  cx=" 8.5" cy="-24.8" r="1.2"           fill="#fff" opacity="0.6"/>

        <!-- Antennae -->
        <path d="M -3,-32 Q -8,-42 -11,-47"  fill="none" stroke="#2a2a2a" stroke-width="1.4" stroke-linecap="round"/>
        <circle cx="-11.5" cy="-48" r="2.5" fill="#5a7a5e"/>
        <path d="M  3,-32 Q  8,-42  11,-47" fill="none" stroke="#2a2a2a" stroke-width="1.4" stroke-linecap="round"/>
        <circle cx=" 11.5" cy="-48" r="2.5" fill="#5a7a5e"/>

      </g>
    </svg>`;

    document.body.appendChild(bee);

    // ── WING FLAP ─────────────────────────────────────────────────────────
    // Front wings: ry oscillates 3 → 13  (~20 Hz)
    // Rear wings:  ry oscillates 2 → 10  (same freq, π/4 phase offset)
    const wFL = bee.querySelector('#ty-w-fl');
    const wFR = bee.querySelector('#ty-w-fr');
    const wRL = bee.querySelector('#ty-w-rl');
    const wRR = bee.querySelector('#ty-w-rr');

    const FRONT_RY_MAX = 13,  FRONT_RY_MIN = 3;
    const REAR_RY_MAX  = 10,  REAR_RY_MIN  = 2;
    const FLAP_SPEED   = 0.06; // radians per ms — ~20 Hz

    function animateWings(ts) {
        const frontRy = FRONT_RY_MIN + (FRONT_RY_MAX - FRONT_RY_MIN) * (0.5 + 0.5 * Math.sin(ts * FLAP_SPEED));
        const rearRy  = REAR_RY_MIN  + (REAR_RY_MAX  - REAR_RY_MIN)  * (0.5 + 0.5 * Math.sin(ts * FLAP_SPEED + Math.PI / 4));
        wFL.setAttribute('ry', frontRy.toFixed(2));
        wFR.setAttribute('ry', frontRy.toFixed(2));
        wRL.setAttribute('ry', rearRy.toFixed(2));
        wRR.setAttribute('ry', rearRy.toFixed(2));
        requestAnimationFrame(animateWings);
    }
    requestAnimationFrame(animateWings);

    // ═══════════════════════════════════════════════════════════════════════
    // DESKTOP MODE — horizontal path along the top navbar
    // ═══════════════════════════════════════════════════════════════════════

    function buildDesktopSegments() {
        const W  = window.innerWidth;
        const x0 = CFG.startMargin;
        const x1 = W - CFG.endMargin;
        const sp = x1 - x0;
        const cx1 = x0 + sp * 0.32;
        const cx2 = x0 + sp * 0.70;

        const loopSegs = SEGS_H.filter(s => s.type === 'loop');
        loopSegs[0].cx = cx1;  loopSegs[0].cy = CFG.navY - loopSegs[0].ry;
        loopSegs[1].cx = cx2;  loopSegs[1].cy = CFG.navY - loopSegs[1].ry;

        const waveSegs = SEGS_H.filter(s => s.type === 'wave');
        waveSegs[0].x0 = x0;   waveSegs[0].x1 = cx1;
        waveSegs[1].x0 = cx1;  waveSegs[1].x1 = cx2;
        waveSegs[2].x0 = cx2;  waveSegs[2].x1 = x1;
    }

    function getDesktopPos(progress) {
        const p = Math.min(1, Math.max(0, progress));
        for (const s of SEGS_H) {
            if (p >= s.t0 && p < s.t1) {
                const lt = (p - s.t0) / (s.t1 - s.t0);
                if (s.type === 'wave') {
                    const wave = s.waveH * Math.sin(lt * s.cycles * Math.PI);
                    const x    = s.x0 + lt * (s.x1 - s.x0);
                    const y    = CFG.navY - wave;
                    const dydl = -s.waveH * s.cycles * Math.PI * Math.cos(lt * s.cycles * Math.PI);
                    const dxdl = s.x1 - s.x0;
                    return { x, y, angle: Math.atan2(dydl, dxdl) * 180 / Math.PI };
                }
                const theta = Math.PI / 2 - lt * 2 * Math.PI;
                return {
                    x:     s.cx + s.rx * Math.cos(theta),
                    y:     s.cy + s.ry * Math.sin(theta),
                    angle: Math.atan2(-s.ry * Math.cos(theta), s.rx * Math.sin(theta)) * 180 / Math.PI,
                };
            }
        }
        const last = SEGS_H[SEGS_H.length - 1];
        return { x: last.x1, y: CFG.navY, angle: 0 };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MOBILE MODE — vertical path down the right edge
    //
    // Geometry for vertical loops:
    //   x = cx + rx·sin(θ)   (oscillates left/right from cx)
    //   y = cy + ry·cos(θ)   (travels up/down)
    //
    // Entry (θ = π/2, lt = 0): x = cx + rx,  y = cy
    //   → cx = navX − rx  so that entry x = navX ✓
    //
    // The loop traces: navX → down-left → leftmost → up-left → navX
    // i.e. a sideways loop-the-loop extending left off the right edge.
    // ═══════════════════════════════════════════════════════════════════════

    let mobileNavX; // computed in buildMobileSegments

    function buildMobileSegments() {
        mobileNavX = window.innerWidth - CFG.navXOffset;
        const H   = window.innerHeight;
        const y0  = CFG.startMarginY;
        const y1  = H - CFG.endMarginY;
        const sp  = y1 - y0;

        // Single loop — centre placed at ~35% of the vertical span
        const cy1 = y0 + sp * 0.35;

        const loopSeg = SEGS_V.find(s => s.type === 'loop');
        loopSeg.cy = cy1;
        loopSeg.cx = mobileNavX - loopSeg.rx;

        // Two wave segments: entry (y0 → cy1) and exit (cy1 → y1)
        const waveSegs = SEGS_V.filter(s => s.type === 'wave');
        waveSegs[0].y0 = y0;   waveSegs[0].y1 = cy1;
        waveSegs[1].y0 = cy1;  waveSegs[1].y1 = y1;
    }

    function getMobilePos(progress) {
        const p = Math.min(1, Math.max(0, progress));
        for (const s of SEGS_V) {
            if (p >= s.t0 && p < s.t1) {
                const lt = (p - s.t0) / (s.t1 - s.t0);

                if (s.type === 'wave') {
                    // Main axis = Y (downward), oscillation = X (leftward from navX)
                    const wave = s.waveH * Math.sin(lt * s.cycles * Math.PI);
                    const y    = s.y0 + lt * (s.y1 - s.y0);
                    const x    = mobileNavX - wave;
                    // Tangent angle — atan2(dy, dx) keeps 0° = facing right, 90° = facing down
                    const dxdl = -s.waveH * s.cycles * Math.PI * Math.cos(lt * s.cycles * Math.PI);
                    const dydl = s.y1 - s.y0;
                    return { x, y, angle: Math.atan2(dydl, dxdl) * 180 / Math.PI };
                }

                // Vertical ellipse traversal
                const theta = Math.PI / 2 - lt * 2 * Math.PI;
                const x     = s.cx + s.rx * Math.sin(theta);
                const y     = s.cy + s.ry * Math.cos(theta);
                // Tangent: dx/dl ∝ -rx·cos(θ),  dy/dl ∝ ry·sin(θ)
                const angle = Math.atan2(s.ry * Math.sin(theta), -s.rx * Math.cos(theta)) * 180 / Math.PI;
                return { x, y, angle };
            }
        }
        const last = SEGS_V[SEGS_V.length - 1];
        return { x: mobileNavX, y: last.y1, angle: 90 };
    }

    // ── DRAW DASHED TRAIL ─────────────────────────────────────────────────
    function drawTrail(getPos) {
        const pts = [];
        for (let i = 0; i <= CFG.pathSamples; i++) {
            const { x, y } = getPos(i / CFG.pathSamples);
            pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        trailPath.setAttribute('d', 'M ' + pts[0] + ' L ' + pts.slice(1).join(' L '));
    }

    // ── SCROLL UPDATE ─────────────────────────────────────────────────────
    let currentGetPos = getDesktopPos;

    function update() {
        const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        const progress  = Math.min(1, Math.max(0, window.scrollY / (maxScroll * CFG.scrollCap)));
        const { x, y, angle } = currentGetPos(progress);
        bee.style.transform =
            `translate(${(x - CFG.beeW / 2).toFixed(1)}px, ${(y - CFG.beeH / 2).toFixed(1)}px) rotate(${angle.toFixed(1)}deg)`;
    }

    // ── INIT & RESIZE ─────────────────────────────────────────────────────
    function init() {
        if (window.innerWidth < MOBILE_BREAKPOINT) {
            buildMobileSegments();
            currentGetPos = getMobilePos;
        } else {
            buildDesktopSegments();
            currentGetPos = getDesktopPos;
        }
        drawTrail(currentGetPos);
        update();
    }

    init();
    window.addEventListener('resize', init,   { passive: true });
    window.addEventListener('scroll', update, { passive: true });

})();
