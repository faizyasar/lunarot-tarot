import { useEffect, useRef } from 'react';

export default function AsciiBackgroundEyes() {
  const containerRef = useRef<HTMLPreElement | null>(null);
  
  // Track mouse coordinates
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 }); // current X/Y, target X/Y
  const blinkRef = useRef({ state: 'open', timer: 0, progress: 1 }); // open, closing, closed, opening

  // Occult/Terminal state controller
  const stateRef = useRef({
    action: 'mouse',       // 'mouse', 'track-element'
    targetId: '',          // ID of target element (e.g., 'wrap-0', 'wrap-1', 'wrap-2')
    crazyUntil: 0,         // timestamp until crazy mode ceases
    trackingUntil: 0,      // timestamp until tracking ceases
    lastMouseX: 0,
    lastMouseY: 0,
    mouseIdleTime: 0,
    activeCardId: '',       // current chosen idle card target
    lastRandomLook: 0,
  });

  useEffect(() => {
    // Center of viewport initially
    const cxViewport = window.innerWidth / 2;
    const cyViewport = window.innerHeight / 2;
    mouseRef.current = {
      x: cxViewport,
      y: cyViewport,
      tx: cxViewport,
      ty: cyViewport,
    };
    stateRef.current.lastMouseX = cxViewport;
    stateRef.current.lastMouseY = cyViewport;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Listen to control commands from other elements
    const handleControl = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail || {};
      const now = performance.now();

      if (detail.action === 'crazy') {
        const duration = detail.duration || 4500;
        stateRef.current.crazyUntil = now + duration;
        // Trigger immediate wild blink state
        blinkRef.current.state = 'closing';
        blinkRef.current.progress = 0;
        blinkRef.current.timer = 0;
      } else if (detail.action === 'track-element') {
        stateRef.current.action = 'track-element';
        stateRef.current.targetId = detail.targetId;
        if (detail.duration) {
          stateRef.current.trackingUntil = now + detail.duration;
        } else {
          stateRef.current.trackingUntil = now + 999999; // persist until reset
        }
      } else if (detail.action === 'reset') {
        stateRef.current.action = 'mouse';
        stateRef.current.targetId = '';
        stateRef.current.trackingUntil = 0;
      }
    };

    window.addEventListener('ascii-eyes-control', handleControl);

    // Grid sizes: width = 104 columns, height = 24 rows
    const COLS = 104;
    const ROWS = 24;
    const CX_L = 30; // Left eye column center
    const CX_R = 74; // Right eye column center
    const CY = 12;   // Eye row center
    const EYE_W = 22; // Width of each eye in characters
    const HEIGHT_MAX = 5.2; // Max half-height

    let animationId: number;
    let blinkTimer = Math.random() * 2000 + 3000; // time until next blink

    const run = (timestamp: number) => {
      const m = mouseRef.current;
      const s = stateRef.current;
      const now = performance.now();

      // Check if crazy mode is active
      const isCrazy = now < s.crazyUntil;

      // Track target search:
      let targetX = m.tx;
      let targetY = m.ty;

      // Reset tracking if duration passed
      if (s.action === 'track-element' && s.trackingUntil > 0 && now > s.trackingUntil) {
        s.action = 'mouse';
        s.targetId = '';
        s.trackingUntil = 0;
      }

      // Check mouse idle to track items randomly
      const mouseMoved = Math.abs(m.tx - s.lastMouseX) > 2 || Math.abs(m.ty - s.lastMouseY) > 2;
      if (mouseMoved) {
        s.mouseIdleTime = 0;
        s.lastMouseX = m.tx;
        s.lastMouseY = m.ty;
        if (s.action === 'track-element' && s.targetId.startsWith('idle-wrap')) {
          s.action = 'mouse';
          s.targetId = '';
        }
      } else {
        s.mouseIdleTime += 16.67;
        // If mouse is idle and we aren't explicitly lock-tracking an event card:
        if (s.mouseIdleTime > 1500 && s.action === 'mouse') {
          // Time to look at a card!
          if (now - s.lastRandomLook > 2500) {
            s.lastRandomLook = now;
            const cardIds = ['wrap-0', 'wrap-1', 'wrap-2'];
            // Check which ones are currently on-screen
            const validIds = cardIds.filter(id => document.getElementById(id) !== null);
            if (validIds.length > 0) {
              s.activeCardId = validIds[Math.floor(Math.random() * validIds.length)];
              s.action = 'track-element';
              s.targetId = s.activeCardId;
              // Make it track the idle card for 2000ms
              s.trackingUntil = now + 1800;
            }
          }
        }
      }

      // Resolve actual coordinate targets
      let isTrackingTarget = false;
      if (s.action === 'track-element' && s.targetId) {
        const el = document.getElementById(s.targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
          isTrackingTarget = true;
        } else {
          // Element went missing (e.g. game resets)
          s.action = 'mouse';
          s.targetId = '';
        }
      }

      // Smooth easing of pupils
      m.x += (targetX - m.x) * (isTrackingTarget ? 0.15 : 0.08);
      m.y += (targetY - m.y) * (isTrackingTarget ? 0.15 : 0.08);

      // Handle Jitter/Shaking for Crazy/Cursed state
      let containerTransform = 'none';
      let shadowColor = 'rgba(200, 164, 90, 0.4)'; // Gold shadow
      let fontColor = 'var(--gold)';

      if (isCrazy) {
        // Shaking translate matrices
        const shakeX = (Math.random() - 0.5) * 18;
        const shakeY = (Math.random() - 0.5) * 18;
        containerTransform = `translate3d(${shakeX}px, ${shakeY}px, 0)`;

        // White-hot flickering
        const chooseFlicker = Math.random();
        if (chooseFlicker < 0.25) {
          shadowColor = 'rgba(255, 255, 255, 0.9)';
          fontColor = '#ffffff';
        } else if (chooseFlicker < 0.6) {
          shadowColor = 'rgba(200, 164, 90, 0.8)';
          fontColor = 'var(--gold)';
        } else {
          shadowColor = 'rgba(239, 237, 232, 0.7)';
          fontColor = '#efede8';
        }
      }

      // 4. Handle Blink Logic
      const blink = blinkRef.current;
      blink.timer += 16.67; // approx ms per frame
      
      if (isCrazy) {
        // Constantly make eyelids twitch and spasm frantically
        blink.progress = 0.35 + 0.65 * Math.sin(timestamp * 0.08) * (Math.random() > 0.5 ? 1 : 0.2);
        blink.state = 'open';
      } else {
        if (blink.state === 'open' && blink.timer > blinkTimer) {
          blink.state = 'closing';
          blink.timer = 0;
        } else if (blink.state === 'closing') {
          blink.progress -= 0.18; // close speed
          if (blink.progress <= 0) {
            blink.progress = 0;
            blink.state = 'closed';
            blink.timer = 0;
          }
        } else if (blink.state === 'closed') {
          if (blink.timer > 100) { // remain closed for 100ms
            blink.state = 'opening';
            blink.timer = 0;
          }
        } else if (blink.state === 'opening') {
          blink.progress += 0.15; // open speed
          if (blink.progress >= 1) {
            blink.progress = 1;
            blink.state = 'open';
            blink.timer = 0;
            blinkTimer = Math.random() * 4000 + 4000; // next blink in 4-8s
          }
        }
      }

      // Calculate look offset vector relative to viewport center
      const dxViewport = m.x - window.innerWidth / 2;
      const dyViewport = m.y - window.innerHeight / 2;
      const dist = Math.hypot(dxViewport, dyViewport) || 1;
      
      // Limit eye motion range
      const limit = 220;
      const factor = Math.min(dist, limit) / limit;
      const angle = Math.atan2(dyViewport, dxViewport);
      
      // Pupil shift configuration (crazy state shifts wider and faster)
      let pupilShiftX = Math.cos(angle) * factor * 4.2;
      let pupilShiftY = Math.sin(angle) * factor * 1.8;

      if (isCrazy) {
        // Sporadic eye rolling and twitching
        pupilShiftX += Math.sin(timestamp * 0.1) * 2.5;
        pupilShiftY += Math.cos(timestamp * 0.12) * 1.3;
      }

      // Render grid
      let out = '';
      const hEye = HEIGHT_MAX * blink.progress; // Current vertical scale of eyes

      // Intricate alchemical character sets for iris levels
      // If crazy, we use forbidden glyphs of the void to represent corrupt anomalies
      const IRIS_RINGS_NORMAL = ['◈', '◇', '✦', '·'];
      const IRIS_RINGS_CRAZY = ['⍼', '☠', '☣', '✖', '✥', '╬', '█', '0', '1'];
      const IRIS_RINGS = isCrazy ? IRIS_RINGS_CRAZY : IRIS_RINGS_NORMAL;

      const PUPIL_CHAR = isCrazy ? (Math.random() > 0.5 ? '⛧' : '✖') : '◉';
      const R_PUPIL = isCrazy ? 1.7 : 1.3; // Pupil dilates wider when crazy!
      const R_IRIS = isCrazy ? 4.2 : 3.6;

      for (let r = 0; r < ROWS; r++) {
        let line = '';
        for (let c = 0; c < COLS; c++) {
          
          // Determine if we are inside of left or right eye layout
          let inLeft = Math.abs(c - CX_L) <= EYE_W / 2;
          let inRight = Math.abs(c - CX_R) <= EYE_W / 2;
          
          if (inLeft || inRight) {
            const eyeCenterX = inLeft ? CX_L : CX_R;
            // Normalize column coordinate to relative range [-1, 1] across eye width
            const tx = (c - eyeCenterX) / (EYE_W / 2); 
            // Calculated top/bottom eyelid limits at this X offset
            const lensFactor = Math.cos(tx * Math.PI / 2); // 1.0 at center, 0.0 at corners
            const boundaryHalfH = hEye * lensFactor;

            const dyFromCenter = r - CY;
            const isInside = Math.abs(dyFromCenter) <= boundaryHalfH;

            if (isInside) {
              if (blink.progress < 0.12 && !isCrazy) {
                // Render seam of closed eye
                line += '—';
              } else {
                // Calculate position relative to moving pupil
                const pCenterX = eyeCenterX + pupilShiftX;
                const pCenterY = CY + pupilShiftY;

                // Non-square aspect scaling factor (characters are taller than they are wide)
                const distToPupil = Math.hypot((c - pCenterX) * 0.75, r - pCenterY);

                if (distToPupil < R_PUPIL) {
                  // Core center pupil
                  line += PUPIL_CHAR;
                } else if (distToPupil < R_IRIS) {
                  // Dynamic nested iris rings
                  const ringIdx = Math.floor((distToPupil - R_PUPIL) * 1.5) % IRIS_RINGS.length;
                  line += IRIS_RINGS[ringIdx];
                } else {
                  // White of the eyes - faint cellular terminal texture
                  const densityVal = (r * 11 + c * 3) % (isCrazy ? 8 : 17);
                  if (densityVal === 0) {
                    line += isCrazy ? '✖' : '·';
                  } else if (densityVal === 1) {
                    line += isCrazy ? '⍼' : '°';
                  } else {
                    line += ' ';
                  }
                }
              }
            } else {
              // Exactly on the boundary edge - eyelid silhouette lines
              const distToBoundary = Math.abs(Math.abs(dyFromCenter) - boundaryHalfH);
              if (distToBoundary < 0.65) {
                if (dyFromCenter < 0) {
                  line += (c % 2 === 0) ? '⎴' : '⎴';
                } else {
                  line += (c % 2 === 0) ? '⎵' : '⎵';
                }
              } else {
                // Faint cosmic telemetry ticks outside the eye area
                const cellCheck = (r * 7 + c * 13) % 233;
                if (cellCheck === 4) {
                  line += isCrazy ? '☠' : '+';
                } else if (cellCheck === 12 && r % 4 === 0) {
                  line += '·';
                } else {
                  line += ' ';
                }
              }
            }
          } else {
            // Outside background frame spacing
            const cellCheck = (r * 7 + c * 13) % 233;
            if (cellCheck === 4 && r % 3 === 0) {
              line += '·';
            } else if (cellCheck === 99 && c % 12 === 0) {
              line += isCrazy ? '⍼' : '+';
            } else if (isCrazy && cellCheck === 33) {
              line += Math.random() > 0.5 ? '1' : '0'; // static void binary leaks
            } else {
              line += ' ';
            }
          }
        }
        out += line + '\n';
      }

      if (containerRef.current) {
        containerRef.current.innerText = out;
        
        // Dynamic styling for crazy shaking state
        containerRef.current.style.transform = containerTransform;
        containerRef.current.style.textShadow = `0 0 12px ${shadowColor}`;
        containerRef.current.style.color = fontColor;
      }

      animationRef.current = requestAnimationFrame(run);
    };

    const animationRef = { current: 0 };
    animationRef.current = requestAnimationFrame(run);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('ascii-eyes-control', handleControl);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div 
      id="asciiEyesContainer" 
      className="fixed inset-0 w-screen h-screen flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden bg-transparent"
    >
      <pre 
        ref={containerRef}
        id="asciiEyesCode"
        className="font-mono text-[7px] leading-[1.0] md:text-[9.5px] text-[var(--gold)]/20 filter blur-[1.5px] select-none pointer-events-none transition-all duration-[80ms] max-w-full"
        style={{
          textShadow: '0 0 4px rgba(200, 164, 90, 0.4)',
        }}
      />
    </div>
  );
}
