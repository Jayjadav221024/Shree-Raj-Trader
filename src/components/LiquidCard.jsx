import React, { useRef, useState } from 'react';

export default function LiquidCard({
  children,
  className = '',
  color = 'cyan', // cyan, orange, emerald, purple
  interactive = true,
  onClick
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35
    });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const colorVariants = {
    cyan: 'liquid-card-cyan border-cyan-500/20 hover:border-cyan-400/50 shadow-cyan-950/30',
    orange: 'liquid-card-orange border-orange-500/20 hover:border-orange-400/50 shadow-orange-950/30',
    emerald: 'liquid-card-emerald border-emerald-500/20 hover:border-emerald-400/50 shadow-emerald-950/30',
    purple: 'liquid-card-cyan border-purple-500/20 hover:border-purple-400/50 shadow-purple-950/30'
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      className={`liquid-card ${colorVariants[color] || colorVariants.cyan} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Glare effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[20px]"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.25) 0%, transparent 65%)`
        }}
      />
      {children}
    </div>
  );
}
