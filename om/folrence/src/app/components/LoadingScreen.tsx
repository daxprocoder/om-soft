import { useEffect, useState } from 'react';
import { Plus, Heart } from 'lucide-react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#0d47a1] via-[#1565c0] to-[#1976d2] flex items-center justify-center overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full animate-pulse-slow blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full animate-pulse-slower blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full animate-ping-slow blur-2xl"></div>
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[15%] animate-float-slow opacity-20">
          <Plus className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
        <div className="absolute top-[60%] right-[20%] animate-float-slower opacity-20">
          <Heart className="w-10 h-10 text-white" strokeWidth={2} />
        </div>
        <div className="absolute bottom-[30%] left-[25%] animate-float opacity-20">
          <Plus className="w-6 h-6 text-white" strokeWidth={2} />
        </div>
        <div className="absolute top-[40%] right-[15%] animate-float-slow opacity-20">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-[20%] right-[30%] animate-float-slower opacity-20">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Stethoscope Animation */}
        <div className="mb-8 relative">
          <svg
            viewBox="0 0 200 200"
            className="w-48 h-48 mx-auto animate-fade-in"
          >
            {/* Stethoscope */}
            <g className="stethoscope-animation">
              {/* Left Ear Tube */}
              <path
                d="M 70 80 Q 70 50 85 35"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                className="draw-line"
                style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
              />
              {/* Right Ear Tube */}
              <path
                d="M 130 80 Q 130 50 115 35"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                className="draw-line delay-1"
                style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
              />

              {/* Main Tube */}
              <path
                d="M 100 95 L 100 150"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                className="draw-line delay-2"
                style={{ strokeDasharray: 55, strokeDashoffset: 55 }}
              />

              {/* Chest Piece Ring */}
              <circle
                cx="100"
                cy="80"
                r="18"
                fill="none"
                stroke="white"
                strokeWidth="4"
                className="draw-circle delay-3"
                style={{ strokeDasharray: 113, strokeDashoffset: 113 }}
              />

              {/* Chest Piece Center */}
              <circle
                cx="100"
                cy="80"
                r="10"
                fill="white"
                className="scale-in delay-4"
                style={{ transform: 'scale(0)', transformOrigin: '100px 80px' }}
              />

              {/* Diaphragm (Bottom) */}
              <circle
                cx="100"
                cy="160"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="4"
                className="draw-circle delay-5"
                style={{ strokeDasharray: 126, strokeDashoffset: 126 }}
              />
              <circle
                cx="100"
                cy="160"
                r="15"
                fill="rgba(255,255,255,0.2)"
                className="scale-in delay-6"
                style={{ transform: 'scale(0)', transformOrigin: '100px 160px' }}
              />

              {/* Earpieces */}
              <circle cx="85" cy="30" r="6" fill="white" className="scale-in delay-7" style={{ transform: 'scale(0)', transformOrigin: '85px 30px' }} />
              <circle cx="115" cy="30" r="6" fill="white" className="scale-in delay-7" style={{ transform: 'scale(0)', transformOrigin: '115px 30px' }} />
            </g>

            {/* Heartbeat Line */}
            <g className="heartbeat-animation">
              <path
                d="M 30 185 L 60 185 L 70 170 L 80 195 L 90 185 L 170 185"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="draw-heartbeat"
                style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
              />
            </g>
          </svg>
        </div>

        {/* Hospital Name */}
        <div className="mb-8 animate-slide-up delay-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center animate-rotate-in delay-9">
              <Plus className="w-6 h-6 text-[#1565c0]" strokeWidth={3} />
            </div>
            <h1 className="font-['Cormorant_Garamond'] font-bold text-4xl text-white">
              Florence Hospital
            </h1>
          </div>
          <p className="text-white/80 text-lg">Expert ENT Care You Can Trust</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto animate-fade-in delay-10">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-lg shadow-white/50"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-3 text-white/60 text-sm font-medium">
            Loading {progress}%
          </div>
        </div>
      </div>

      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes scaleIn {
          to { transform: scale(1); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-180deg) scale(0);
          }
          to {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        @keyframes ping-slow {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }

        .draw-line { animation: draw 1s ease-out forwards; }
        .draw-circle { animation: draw 0.8s ease-out forwards; }
        .scale-in { animation: scaleIn 0.5s ease-out forwards; }
        .draw-heartbeat { animation: draw 1.5s ease-out forwards; }

        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
        .animate-rotate-in { animation: rotateIn 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }

        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 4s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s ease-out infinite; }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
        .delay-4 { animation-delay: 0.8s; }
        .delay-5 { animation-delay: 1s; }
        .delay-6 { animation-delay: 1.2s; }
        .delay-7 { animation-delay: 1.4s; }
        .delay-8 { animation-delay: 1.6s; opacity: 0; }
        .delay-9 { animation-delay: 1.8s; opacity: 0; }
        .delay-10 { animation-delay: 2s; opacity: 0; }
      `}</style>
    </div>
  );
}
