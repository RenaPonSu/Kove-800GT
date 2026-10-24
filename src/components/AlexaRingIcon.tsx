import React from 'react';

interface AlexaRingIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'idle' | 'listening' | 'speaking';
  className?: string;
  withGlow?: boolean;
}

export const AlexaRingIcon: React.FC<AlexaRingIconProps> = ({
  size = 'md',
  status = 'idle',
  className = '',
  withGlow = true
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const ringThickness = {
    sm: 'p-[2px]',
    md: 'p-[2.5px]',
    lg: 'p-[3.5px]',
    xl: 'p-[5px]'
  };

  const isAnimated = status === 'listening' || status === 'speaking';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
      title={status === 'speaking' ? 'Alexa is speaking' : status === 'listening' ? 'Alexa is listening' : 'Alexa voice assistant'}
    >
      {/* Outer Cyan Alexa Glow Bloom */}
      {withGlow && (
        <div
          className={`absolute inset-0 rounded-full blur-md transition-all duration-300 pointer-events-none ${
            status === 'listening'
              ? 'bg-cyan-400/80 scale-125 animate-pulse'
              : status === 'speaking'
              ? 'bg-cyan-400/60 scale-110'
              : 'bg-cyan-500/20'
          }`}
        />
      )}

      {/* Rotating Alexa Conic Gradient Ring */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all ${ringThickness[size]} ${
          isAnimated ? 'alexa-spin-gradient' : 'bg-gradient-to-tr from-[#005cbb] via-[#00caff] to-[#23d5ab]'
        } ${status === 'listening' ? 'alexa-pulse-ring' : ''}`}
      >
        {/* Dark Inner Core with Amazon Alexa Silhouette / Wave */}
        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
          {/* Subtle inner radial glow */}
          <div className="absolute inset-0 bg-radial from-cyan-900/30 to-transparent pointer-events-none" />

          {status === 'speaking' ? (
            /* Mini animated voice bars */
            <div className="flex items-center justify-center gap-0.5">
              <span className="w-0.5 h-2 bg-cyan-400 rounded-full alexa-wave-1" />
              <span className="w-0.5 h-3 bg-cyan-300 rounded-full alexa-wave-2" />
              <span className="w-0.5 h-1.5 bg-teal-400 rounded-full alexa-wave-3" />
            </div>
          ) : status === 'listening' ? (
            /* Listening pulse dot */
            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
          ) : (
            /* Iconic Alexa Ring Smile Accent / Stylized Echo Ring */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-3/5 h-3/5 text-cyan-400"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Alexa Speech Ring Arc */}
              <circle
                cx="12"
                cy="12"
                r="7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="36 8"
                className="opacity-90"
              />
              <circle cx="12" cy="12" r="2.2" fill="currentColor" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
