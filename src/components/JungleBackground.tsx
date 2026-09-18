import React from 'react';

const JungleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 120%, #1a3a1a 0%, #0a1f0a 50%, #050f05 100%)
          `,
        }}
      />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Top-left monstera leaf */}
      <div className="absolute -top-10 -left-16 float-leaf-1" style={{ opacity: 0.7 }}>
        <svg width="320" height="350" viewBox="0 0 320 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="rotate(-20, 160, 175)">
            <path
              d="M160 20 C160 20, 80 80, 60 160 C40 240, 80 320, 160 340 C240 320, 280 240, 260 160 C240 80, 160 20, 160 20Z"
              fill="#0d3d0d"
              opacity="0.8"
            />
            <path
              d="M160 20 C160 20, 100 100, 90 180 C80 260, 110 310, 160 340"
              stroke="#1a5c1a"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
            <path d="M160 80 L120 60" stroke="#1a5c1a" strokeWidth="2" opacity="0.4" />
            <path d="M140 130 L90 100" stroke="#1a5c1a" strokeWidth="2" opacity="0.4" />
            <path d="M130 180 L70 160" stroke="#1a5c1a" strokeWidth="2" opacity="0.4" />
            <path d="M120 230 L65 220" stroke="#1a5c1a" strokeWidth="2" opacity="0.4" />
            <path d="M180 80 L220 50" stroke="#1a5c1a" strokeWidth="2" opacity="0.4" />
            <path d="M190 140 L240 110" stroke="#1a5c1a" strokeWidth="2" opacity="0.4" />
            <path d="M195 200 L250 180" stroke="#1a5c1a" strokeWidth="2" opacity="0.4" />
            {/* Holes in monstera */}
            <ellipse cx="120" cy="140" rx="15" ry="20" fill="#0a1f0a" opacity="0.5" />
            <ellipse cx="190" cy="160" rx="12" ry="18" fill="#0a1f0a" opacity="0.5" />
            <ellipse cx="140" cy="230" rx="10" ry="15" fill="#0a1f0a" opacity="0.4" />
          </g>
        </svg>
      </div>

      {/* Top-right palm frond */}
      <div className="absolute -top-5 -right-20 float-leaf-2" style={{ opacity: 0.6 }}>
        <svg width="350" height="300" viewBox="0 0 350 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="rotate(25, 175, 150)">
            <path
              d="M175 10 C220 40, 300 80, 330 150 C300 130, 240 110, 175 130 C110 110, 50 130, 20 150 C50 80, 130 40, 175 10Z"
              fill="#0b350b"
              opacity="0.7"
            />
            <path d="M175 10 L175 130" stroke="#1a5c1a" strokeWidth="3" opacity="0.5" />
            <path d="M175 50 L230 35" stroke="#145214" strokeWidth="1.5" opacity="0.4" />
            <path d="M175 50 L120 35" stroke="#145214" strokeWidth="1.5" opacity="0.4" />
            <path d="M175 80 L260 55" stroke="#145214" strokeWidth="1.5" opacity="0.4" />
            <path d="M175 80 L90 55" stroke="#145214" strokeWidth="1.5" opacity="0.4" />
            <path d="M175 110 L280 90" stroke="#145214" strokeWidth="1.5" opacity="0.3" />
            <path d="M175 110 L70 90" stroke="#145214" strokeWidth="1.5" opacity="0.3" />
          </g>
        </svg>
      </div>

      {/* Bottom-left fern */}
      <div className="absolute -bottom-10 -left-10 float-leaf-3" style={{ opacity: 0.5 }}>
        <svg width="280" height="320" viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="rotate(15, 140, 160)">
            <path
              d="M140 300 C140 300, 130 200, 120 150 C110 100, 100 60, 140 20 C180 60, 170 100, 160 150 C150 200, 140 300, 140 300Z"
              fill="#0e3e0e"
              opacity="0.6"
            />
            <path d="M140 300 L140 20" stroke="#1a5c1a" strokeWidth="2" opacity="0.4" />
            {/* Fern leaflets */}
            <path d="M135 260 C110 250, 80 260, 60 280" stroke="#0e3e0e" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M145 260 C170 250, 200 260, 220 280" stroke="#0e3e0e" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M132 220 C105 210, 70 215, 45 235" stroke="#0e3e0e" strokeWidth="7" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M148 220 C175 210, 210 215, 235 235" stroke="#0e3e0e" strokeWidth="7" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M130 180 C100 170, 65 175, 40 195" stroke="#0e3e0e" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round" />
            <path d="M150 180 C180 170, 215 175, 240 195" stroke="#0e3e0e" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Bottom-right tropical leaf */}
      <div className="absolute -bottom-16 -right-16 float-leaf-1" style={{ opacity: 0.55, animationDelay: '-3s' }}>
        <svg width="300" height="340" viewBox="0 0 300 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="rotate(-30, 150, 170) scale(-1, 1) translate(-300, 0)">
            <path
              d="M150 20 C150 20, 70 80, 50 160 C30 240, 70 310, 150 330 C230 310, 270 240, 250 160 C230 80, 150 20, 150 20Z"
              fill="#0c380c"
              opacity="0.7"
            />
            <path
              d="M150 20 L150 330"
              stroke="#1a5c1a"
              strokeWidth="3"
              opacity="0.5"
            />
            <ellipse cx="110" cy="140" rx="14" ry="18" fill="#0a1f0a" opacity="0.4" />
            <ellipse cx="180" cy="170" rx="12" ry="16" fill="#0a1f0a" opacity="0.4" />
            <ellipse cx="130" cy="240" rx="10" ry="14" fill="#0a1f0a" opacity="0.3" />
          </g>
        </svg>
      </div>

      {/* Small leaves scattered */}
      <div className="absolute top-1/4 -left-4 float-leaf-2 opacity-30" style={{ animationDelay: '-2s' }}>
        <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
          <path d="M40 10 C60 30, 70 60, 60 90 C50 110, 40 115, 40 115 C40 115, 30 110, 20 90 C10 60, 20 30, 40 10Z" fill="#0d3d0d" />
          <path d="M40 10 L40 115" stroke="#1a5c1a" strokeWidth="1.5" opacity="0.5" />
        </svg>
      </div>

      <div className="absolute top-1/3 -right-4 float-leaf-3 opacity-25" style={{ animationDelay: '-5s' }}>
        <svg width="70" height="100" viewBox="0 0 70 100" fill="none">
          <path d="M35 5 C55 25, 65 50, 55 75 C45 95, 35 100, 35 100 C35 100, 25 95, 15 75 C5 50, 15 25, 35 5Z" fill="#0b350b" />
          <path d="M35 5 L35 100" stroke="#145214" strokeWidth="1.5" opacity="0.4" />
        </svg>
      </div>

      {/* Light rays from top */}
      <div className="absolute top-0 left-1/4 w-1 h-full light-ray" style={{ background: 'linear-gradient(180deg, rgba(255,255,200,0.06) 0%, transparent 60%)', width: '200px', transform: 'rotate(15deg)', transformOrigin: 'top center' }} />
      <div className="absolute top-0 right-1/3 w-1 h-full light-ray" style={{ background: 'linear-gradient(180deg, rgba(255,255,200,0.04) 0%, transparent 50%)', width: '150px', transform: 'rotate(-10deg)', transformOrigin: 'top center', animationDelay: '-3s' }} />

      {/* Firefly dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '3px',
            height: '3px',
            background: 'radial-gradient(circle, rgba(200,255,150,0.8) 0%, transparent 70%)',
            boxShadow: '0 0 6px rgba(200,255,150,0.4)',
            top: `${15 + Math.random() * 70}%`,
            left: `${5 + Math.random() * 90}%`,
            animation: `firefly ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,15,5,0.6) 100%)',
        }}
      />

      {/* Bottom earth gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(30,20,10,0.4) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default JungleBackground;
