import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';
import {
  Trophy,
  Gamepad2,
  Calendar,
  MapPin,
  FileCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Smartphone,
  Users
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, isParticipant } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-[#FFD600] selection:text-black">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden border-b border-zinc-800/80 cyber-grid-yellow">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD600]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Techfest Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-[#FFD600]/30 text-xs font-bold text-[#FFD600] mb-8 shadow-yellow-glow animate-pulse">
              <Sparkles className="w-4 h-4 text-[#FFD600]" />
              <span>OFFICIAL eSPORTS EVENT • {TOURNAMENT_CONFIG.techfestName}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase leading-none mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD600] via-[#FFE033] to-[#C7A700]">
                {TOURNAMENT_CONFIG.tournamentName}
              </span>
            </h1>

            {/* Subtitle Below Main Title */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
              <span className="h-[2px] w-6 sm:w-14 bg-gradient-to-r from-transparent to-[#FFD600]"></span>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-[#FFD600] drop-shadow-[0_2px_12px_rgba(255,214,0,0.35)]">
                E-Football Tournament
              </h2>
              <span className="h-[2px] w-6 sm:w-14 bg-gradient-to-l from-transparent to-[#FFD600]"></span>
            </div>

            <p className="text-lg md:text-xl text-zinc-400 mb-10 font-normal leading-relaxed max-w-2xl mx-auto">
              Compete. Conquer. Become the Champion. Test your mobile football skills at <span className="text-white font-bold">{TOURNAMENT_CONFIG.venue}</span> on <span className="text-white font-bold">{TOURNAMENT_CONFIG.eventDate}</span>! Entry fee: <span className="text-[#FFD600] font-bold">₹{TOURNAMENT_CONFIG.registrationFee}</span>. Limited to <span className="text-[#FFD600] font-bold">{TOURNAMENT_CONFIG.maxParticipants} Participant Seats</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated && isParticipant ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-base tracking-wider transition-all shadow-yellow-glow flex items-center justify-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  VIEW MY REGISTRATION STATUS
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-base tracking-wider transition-all shadow-yellow-glow flex items-center justify-center gap-2 group"
                >
                  <Trophy className="w-5 h-5" />
                  REGISTER FOR TOURNAMENT
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <Link
                to="/participants"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-base transition-all border border-zinc-800 hover:border-[#FFD600]/40 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5 text-[#FFD600]" />
                VIEW PARTICIPANTS
              </Link>

              <Link
                to="/rules"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-base transition-all border border-zinc-800 flex items-center justify-center gap-2"
              >
                <FileCheck className="w-5 h-5 text-[#FFD600]" />
                VIEW RULES & REGULATIONS
              </Link>
            </div>

            {/* Quick Stat Highlights */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
              <div className="p-3 text-center border-r border-zinc-800/80 last:border-none">
                <div className="text-2xl font-bold font-display text-[#FFD600]">
                  {TOURNAMENT_CONFIG.prizePool}
                </div>
                <div className="text-xs text-zinc-400 uppercase font-semibold">Prize Pool</div>
              </div>
              <div className="p-3 text-center border-r border-zinc-800/80 last:border-none">
                <div className="text-2xl font-bold font-display text-white">
                  ₹{TOURNAMENT_CONFIG.registrationFee}
                </div>
                <div className="text-xs text-zinc-400 uppercase font-semibold">Entry Fee</div>
              </div>
              <div className="p-3 text-center border-r border-zinc-800/80 last:border-none">
                <div className="text-2xl font-bold font-display text-[#FFD600]">
                  {TOURNAMENT_CONFIG.maxParticipants} Seats
                </div>
                <div className="text-xs text-zinc-400 uppercase font-semibold">Max Capacity</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-2xl font-bold font-display text-white">
                  Mobile Only
                </div>
                <div className="text-xs text-zinc-400 uppercase font-semibold">Platform</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* EVENT FEATURES & PRIZE BREAKDOWN */}
      <section className="py-20 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-extrabold uppercase text-white tracking-wide">
              TOURNAMENT <span className="text-[#FFD600]">DETAILS & REWARDS</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              Official parameters for {TOURNAMENT_CONFIG.tournamentName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-[#FFD600]/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Prize Pool & Rewards
              </h3>
              <p className="text-sm font-semibold text-[#FFD600] leading-relaxed mb-4">
                {TOURNAMENT_CONFIG.prizeDescription}
              </p>
              <ul className="space-y-2 text-sm text-zinc-400">
                {TOURNAMENT_CONFIG.prizeBreakdown.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between py-1 border-b border-zinc-800/60 last:border-none">
                    <span className="text-zinc-300">{item.rank}</span>
                    <span className="font-bold text-[#FFD600]">{item.prize}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-3.5 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Prize Policy:</span>
                  <span className="font-bold text-white">Cash prizes for 1st & 2nd place only</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max Pool Cap:</span>
                  <span className="text-[#FFD600]">₹1,600 collection (32 seats @ ₹50)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Event Reserve:</span>
                  <span>₹200 allocated for tournament expenses</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-[#FFD600]/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Game & Platform
              </h3>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li className="flex justify-between">
                  <span>Tournament Name:</span>
                  <span className="font-semibold text-[#FFD600]">{TOURNAMENT_CONFIG.tournamentName}</span>
                </li>
                <li className="flex justify-between">
                  <span>Platform:</span>
                  <span className="font-semibold text-white">Mobile Only</span>
                </li>
                <li className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-semibold text-white">32 Seats</span>
                </li>
                <li className="flex justify-between">
                  <span>Entry Fee:</span>
                  <span className="font-semibold text-[#FFD600]">₹{TOURNAMENT_CONFIG.registrationFee}</span>
                </li>
                <li className="flex justify-between">
                  <span>Match Duration:</span>
                  <span className="font-semibold text-white">{TOURNAMENT_CONFIG.gameDetails.matchDuration}</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-[#FFD600]/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Venue & Date
              </h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs uppercase text-zinc-500 font-semibold">Tournament Date</span>
                    <span className="font-semibold text-white">{TOURNAMENT_CONFIG.eventDate} ({TOURNAMENT_CONFIG.eventTime})</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs uppercase text-zinc-500 font-semibold">Venue</span>
                    <span className="font-semibold text-white">{TOURNAMENT_CONFIG.venue}</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* REGISTRATION WORKFLOW GUIDE */}
      <section className="py-20 bg-zinc-950 border-t border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-extrabold uppercase text-white tracking-wide">
              HOW TO <span className="text-[#FFD600]">REGISTER</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              4 quick steps to secure your slot in MINI MAYHEM (32 Seats Limit).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-[#FFD600] text-black font-extrabold flex items-center justify-center font-display text-lg mb-4">
                01
              </div>
              <h4 className="font-display text-xl font-bold text-white mb-2">
                Create Account / Login
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sign up as a participant using your email and phone number.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-[#FFD600] text-black font-extrabold flex items-center justify-center font-display text-lg mb-4">
                02
              </div>
              <h4 className="font-display text-xl font-bold text-white mb-2">
                Accept Tournament Rules
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Read through match rules and check the mandatory agreement box.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-[#FFD600] text-black font-extrabold flex items-center justify-center font-display text-lg mb-4">
                03
              </div>
              <h4 className="font-display text-xl font-bold text-white mb-2">
                Pay Fee & Upload Screenshot
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pay ₹{TOURNAMENT_CONFIG.registrationFee} via UPI ID and upload a clear payment proof screenshot.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-[#FFD600] text-black font-extrabold flex items-center justify-center font-display text-lg mb-4">
                04
              </div>
              <h4 className="font-display text-xl font-bold text-white mb-2">
                Admin Verification
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Track status on your dashboard. Once approved by admin, your slot is locked!
              </p>
            </div>

          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold transition-all shadow-yellow-glow text-base"
            >
              START REGISTRATION NOW
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;
