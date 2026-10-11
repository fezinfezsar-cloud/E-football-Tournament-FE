import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Gamepad2 } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-[#09090b]">
      <div className="w-20 h-20 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-2xl flex items-center justify-center mb-6 shadow-yellow-glow">
        <Gamepad2 className="w-10 h-10 text-[#FFD600]" />
      </div>
      <h1 className="text-6xl font-black font-display tracking-tight text-white mb-2">
        404
      </h1>
      <h2 className="text-2xl font-bold font-display uppercase tracking-wider text-[#FFD600] mb-4">
        OUT OF BOUNDS — PAGE NOT FOUND
      </h2>
      <p className="text-zinc-400 text-sm max-w-md mb-8 leading-relaxed">
        The match page or resource you are searching for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-sm uppercase transition-all shadow-yellow-glow"
      >
        <Home className="w-4 h-4" />
        RETURN TO HOME ARENA
      </Link>
    </div>
  );
};

export default NotFoundPage;
