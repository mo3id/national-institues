
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const NISLogo: React.FC<LogoProps> = ({ className = "h-12 w-12", showText = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Shield Border */}
        <path 
          d="M50 80 Q 200 20 350 80 L 350 280 Q 200 400 50 280 Z" 
          fill="white" 
          stroke="#1e3a8a" 
          strokeWidth="10" 
        />
        
        {/* Top Text - National Institutes */}
        <path id="curve" d="M 80,120 Q 200,80 320,120" fill="transparent" />
        <text className="font-bold uppercase tracking-widest" style={{ fontSize: '28px', fill: '#991b1b' }}>
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            National Institutes
          </textPath>
        </text>

        {/* Inner Figures (Red Students) */}
        <g transform="translate(135, 150) scale(1.3)">
          <circle cx="25" cy="15" r="15" fill="#991b1b" />
          <circle cx="75" cy="15" r="15" fill="#991b1b" />
          <path d="M10 60 Q 50 30 90 60 L 70 80 Q 50 60 30 80 Z" fill="#991b1b" />
        </g>

        {/* Blue Framing Hands/Leaves */}
        <g fill="#1e3a8a">
          <path d="M80 180 Q 100 350 200 350 Q 120 300 110 200 Z" />
          <path d="M320 180 Q 300 350 200 350 Q 280 300 290 200 Z" />
        </g>

        {/* Stars Arc */}
        {[...Array(11)].map((_, i) => {
          const angle = (i * (180 / 10)) * (Math.PI / 180);
          const r = 160;
          const cx = 200 - Math.cos(angle) * r;
          const cy = 250 + Math.sin(angle) * 80;
          const isRed = i % 2 === 0;
          return (
            <path
              key={i}
              d="M0,-8 L2, -2 L8, -2 L3, 2 L5, 8 L0, 4 L-5, 8 L-3, 2 L-8, -2 L-2, -2 Z"
              transform={`translate(${cx}, ${cy}) scale(0.8)`}
              fill={isRed ? "#991b1b" : "#1e3a8a"}
            />
          );
        })}
      </svg>
      {showText && (
        <span className="text-[14px] font-bold text-[#1e3a8a] mt-2 arabic-font text-center leading-tight">
          الجمعية العامة للمعاهد القومية
        </span>
      )}
    </div>
  );
};

export default NISLogo;
