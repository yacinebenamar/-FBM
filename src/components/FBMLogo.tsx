import React from 'react';

interface FBMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function FBMLogo({ className = '', size = 'md' }: FBMLogoProps) {
  const dimensions = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20',
    xl: 'h-24'
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="rounded-2xl border border-emerald-500/20 bg-[#050E46]/70 p-2 shadow-[0_0_24px_rgba(118,188,33,0.14)]">
        <img
          src="/fbm_logo.jpg"
          alt="FBM Logo"
          className={`${dimensions} w-auto max-w-[120px] object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]`}
        />
      </div>
    </div>
  );
}
