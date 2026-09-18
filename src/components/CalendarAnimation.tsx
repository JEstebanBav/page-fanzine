import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CALENDAR_IMAGE = './pages/calendar-final.png';
const GRID_COLS = 5;
const GRID_ROWS = 4;
const TOTAL_PIECES = GRID_COLS * GRID_ROWS;

const PAGE_THUMBS = [
  './pages/page1.png',
  './pages/page2.png',
  './pages/page3.png',
  './pages/page4.png',
  './pages/page5.png',
  './pages/page6.png',
  './pages/page7.png',
  './pages/page8.png',
];

interface CalendarAnimationProps {
  active: boolean;
  onBack?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'glow' | 'leaf';
  rotation: number;
  rotationSpeed: number;
}

const CalendarAnimation: React.FC<CalendarAnimationProps> = ({ active, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const piecesRef = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [phase, setPhase] = useState<'idle' | 'scatter' | 'assemble' | 'complete'>('idle');
  const [showComplete, setShowComplete] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const createParticle = useCallback((x: number, y: number): Particle => {
    const isLeaf = Math.random() > 0.6;
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3 - 1,
      life: 0,
      maxLife: 60 + Math.random() * 120,
      size: isLeaf ? 4 + Math.random() * 6 : 2 + Math.random() * 3,
      color: isLeaf
        ? `hsla(${100 + Math.random() * 40}, 70%, ${40 + Math.random() * 20}%, `
        : `hsla(${50 + Math.random() * 20}, 80%, ${70 + Math.random() * 20}%, `,
      type: isLeaf ? 'leaf' : 'glow',
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
  }, []);

  // Particle system
  useEffect(() => {
    if (!active || phase === 'idle') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (phase === 'scatter' || phase === 'assemble') {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(
            createParticle(
              Math.random() * canvas.width,
              Math.random() * canvas.height
            )
          );
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01; // slight gravity
        p.rotation += p.rotationSpeed;

        const alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'glow') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (alpha * 0.6) + ')';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (alpha * 0.15) + ')';
          ctx.fill();
        } else {
          // Leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (alpha * 0.5) + ')';
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, phase, createParticle]);

  // Main animation sequence
  useEffect(() => {
    if (!active) {
      setPhase('idle');
      setShowComplete(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    setPhase('scatter');

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('complete');
        setShowComplete(true);
      },
    });
    timelineRef.current = tl;

    // Phase 1: Page thumbnails fly in and scatter
    const thumbEls = container.querySelectorAll('.page-thumb');
    tl.fromTo(
      thumbEls,
      {
        scale: 0.3,
        opacity: 0,
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.5,
        y: () => window.innerHeight * 0.5,
        rotation: () => (Math.random() - 0.5) * 60,
      },
      {
        scale: 0.6,
        opacity: 1,
        x: () => (Math.random() - 0.5) * 300,
        y: () => (Math.random() - 0.5) * 200,
        rotation: () => (Math.random() - 0.5) * 30,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power3.out',
      }
    );

    // Phase 2: Thumbnails fragment and scatter further
    tl.to(thumbEls, {
      scale: 0.15,
      opacity: 0.3,
      x: () => (Math.random() - 0.5) * window.innerWidth * 0.8,
      y: () => (Math.random() - 0.5) * window.innerHeight * 0.6,
      rotation: () => (Math.random() - 0.5) * 180,
      duration: 1,
      stagger: 0.04,
      ease: 'power2.inOut',
      onStart: () => setPhase('assemble'),
    });

    // Phase 3: Puzzle pieces appear and assemble
    tl.to(
      thumbEls,
      {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        stagger: 0.02,
      },
      '-=0.5'
    );

    // Animate puzzle pieces from scattered to assembled
    piecesRef.current.forEach((piece, i) => {
      if (!piece) return;
      const col = i % GRID_COLS;
      const row = Math.floor(i / GRID_COLS);

      const startX = (Math.random() - 0.5) * window.innerWidth;
      const startY = (Math.random() - 0.5) * window.innerHeight;
      const startRotation = (Math.random() - 0.5) * 360;
      const startScale = 0.2 + Math.random() * 0.3;

      // Set initial scattered position
      gsap.set(piece, {
        x: startX,
        y: startY,
        rotation: startRotation,
        scale: startScale,
        opacity: 0,
      });

      // Animate to final position
      const delay = 2.2 + (row * GRID_COLS + col) * 0.06;
      tl.to(
        piece,
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.inOut',
        },
        delay
      );
    });

    // Phase 4: Flash/glow when complete
    tl.to(
      '.calendar-glow',
      {
        opacity: 0.4,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 50 }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Content container */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
        style={{ width: '90vw', height: '80vh', maxWidth: '900px', maxHeight: '700px' }}
      >
        {/* Floating page thumbnails */}
        {PAGE_THUMBS.map((src, i) => (
          <div
            key={`thumb-${i}`}
            className="page-thumb absolute"
            style={{
              width: '120px',
              height: '168px',
              zIndex: 5,
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover rounded shadow-lg"
              draggable={false}
            />
          </div>
        ))}

        {/* Puzzle grid */}
        <div
          className="relative"
          style={{
            width: '100%',
            maxWidth: '750px',
            aspectRatio: '16/11',
          }}
        >
          <div
            className="grid relative"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              width: '100%',
              height: '100%',
            }}
          >
            {Array.from({ length: TOTAL_PIECES }, (_, i) => {
              const col = i % GRID_COLS;
              const row = Math.floor(i / GRID_COLS);
              return (
                <div
                  key={`piece-${i}`}
                  ref={(el) => { piecesRef.current[i] = el; }}
                  className="puzzle-piece overflow-hidden"
                  style={{
                    backgroundImage: `url(${CALENDAR_IMAGE})`,
                    backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
                    backgroundPosition: `${(col / (GRID_COLS - 1)) * 100}% ${(row / (GRID_ROWS - 1)) * 100}%`,
                    opacity: 0,
                  }}
                />
              );
            })}
          </div>

          {/* Glow overlay */}
          <div
            className="calendar-glow absolute inset-0 opacity-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: '0 0 80px 40px rgba(34,197,94,0.3), inset 0 0 60px rgba(34,197,94,0.1)',
            }}
          />
        </div>

        {/* Complete state: show full image with final effect */}
        {showComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative" style={{ maxWidth: '750px', width: '100%' }}>
              <img
                src={CALENDAR_IMAGE}
                alt="Calendario Final"
                className="w-full h-auto rounded-lg shadow-2xl"
                style={{
                  animation: 'fadeIn 1s ease-out',
                }}
                draggable={false}
              />
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  boxShadow: '0 0 60px 20px rgba(34,197,94,0.15)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white/80 hover:text-white rounded-full backdrop-blur-sm transition-all duration-300 font-body text-sm"
        aria-label="Volver al libro"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      {/* Title that appears when complete */}
      {showComplete && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          style={{ animation: 'fadeIn 1.5s ease-out' }}
        >
          <h2 className="font-display text-2xl md:text-3xl text-white/90 tracking-wide">
            Calendario Completo
          </h2>
          <p className="font-body text-sm text-jungle-400/80 mt-2 tracking-widest uppercase">
            Todas las piezas unidas
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CalendarAnimation;
