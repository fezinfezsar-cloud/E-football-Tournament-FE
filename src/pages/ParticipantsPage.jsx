import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  Search,
  Trophy,
  Smartphone,
  Building,
  ShieldCheck,
  Eye,
  X,
  ExternalLink,
  Sparkles,
  Gamepad2,
  ArrowRight
} from 'lucide-react';

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const [stats, setStats] = useState({
    confirmedCount: 0,
    maxCapacity: 32,
    remainingSlots: 32,
    isFull: false
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGamePlan, setSelectedGamePlan] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data } = await API.get('/tournament/participants');
        setParticipants(data.participants || []);
        setStats({
          confirmedCount: data.confirmedCount || 0,
          maxCapacity: data.maxCapacity || 32,
          remainingSlots: data.remainingSlots !== undefined ? data.remainingSlots : 32,
          isFull: data.isFull || false
        });
      } catch (err) {
        console.error('Failed to load participants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  // Filter participants by search query
  const filteredParticipants = participants.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.displayName && p.displayName.toLowerCase().includes(q)) ||
      (p.efFootballId && p.efFootballId.toLowerCase().includes(q)) ||
      (p.college && p.college.toLowerCase().includes(q)) ||
      (p.teamName && p.teamName.toLowerCase().includes(q)) ||
      (p.registrationId && p.registrationId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#FFD600] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* PAGE HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/30 text-xs font-bold text-[#FFD600] shadow-yellow-glow">
            <Sparkles className="w-4 h-4" />
            <span>MINI MAYHEM • OFFICIAL BRACKET ROSTER</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
            CONFIRMED <span className="text-[#FFD600]">PARTICIPANTS</span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Browse all verified and approved contenders for <strong className="text-white">{TOURNAMENT_CONFIG.tournamentName}</strong> at {TOURNAMENT_CONFIG.venue} on {TOURNAMENT_CONFIG.eventDate}.
          </p>
        </div>

        {/* TOURNAMENT CAPACITY & STATS BAR */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase text-zinc-500 font-bold block">Confirmed Contestants</span>
                <span className="text-2xl font-black font-display text-[#FFD600]">
                  {stats.confirmedCount} <span className="text-sm font-semibold text-zinc-400">/ {stats.maxCapacity}</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                <Users className="w-6 h-6 text-[#FFD600]" />
              </div>
              <div>
                <span className="text-xs uppercase text-zinc-500 font-bold block">Remaining Slots</span>
                <span className="text-2xl font-black font-display text-white">
                  {stats.remainingSlots} <span className="text-sm font-semibold text-zinc-400">Slots Left</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                <Trophy className="w-6 h-6 text-[#FFD600]" />
              </div>
              <div>
                <span className="text-xs uppercase text-zinc-500 font-bold block">Tournament Status</span>
                <span className={`text-sm font-extrabold uppercase tracking-wider inline-block px-2.5 py-1 rounded-lg ${
                  stats.isFull
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {stats.isFull ? 'CAPACITY FULL' : 'REGISTRATION OPEN'}
                </span>
              </div>
            </div>

          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-zinc-400">
              <span>Bracket Fill Progress</span>
              <span className="text-[#FFD600]">{Math.round((stats.confirmedCount / stats.maxCapacity) * 100)}% Filled</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#FFD600] transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.confirmedCount / stats.maxCapacity) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* SEARCH FILTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="participant-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by player, Gamer ID, college..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition-all text-sm"
            />
          </div>

          <div className="text-xs text-zinc-400 self-end sm:self-center font-medium">
            Showing <strong className="text-white">{filteredParticipants.length}</strong> of{' '}
            <strong className="text-[#FFD600]">{stats.confirmedCount}</strong> confirmed participants
          </div>
        </div>

        {/* PARTICIPANTS GRID */}
        {loading ? (
          <div className="py-20 text-center">
            <LoadingSpinner message="Loading confirmed participants..." />
          </div>
        ) : filteredParticipants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParticipants.map((p, idx) => {
              const initials = p.displayName
                ? p.displayName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'PL';

              return (
                <div
                  key={p.registrationId || idx}
                  className="rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#FFD600]/40 transition-all duration-300 p-6 flex flex-col justify-between group shadow-lg hover:shadow-yellow-glow/10"
                >
                  <div className="space-y-4">
                    
                    {/* Header Row: Avatar, Name & Status */}
                    <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center font-display font-extrabold text-base text-[#FFD600] group-hover:scale-105 transition-transform shrink-0">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-white group-hover:text-[#FFD600] transition-colors leading-tight">
                            {p.displayName}
                          </h3>
                          <span className="font-mono text-[11px] text-[#FFD600] block mt-0.5">
                            {p.registrationId}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider shrink-0">
                        CONFIRMED
                      </span>
                    </div>

                    {/* Participant Details */}
                    <div className="space-y-2.5 text-xs text-zinc-300">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/60">
                        <span className="text-zinc-500 uppercase font-bold text-[10px] flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-[#FFD600]" />
                          Gamer / Player ID
                        </span>
                        <span className="font-bold text-white font-mono">
                          {p.efFootballId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/60">
                        <span className="text-zinc-500 uppercase font-bold text-[10px] flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#FFD600]" />
                          College
                        </span>
                        <span className="font-medium text-zinc-200 truncate max-w-[150px]">
                          {p.college}
                        </span>
                      </div>

                      {p.teamName && (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/60">
                          <span className="text-zinc-500 uppercase font-bold text-[10px] flex items-center gap-1.5">
                            <Gamepad2 className="w-3.5 h-3.5 text-[#FFD600]" />
                            Squad / Team
                          </span>
                          <span className="font-medium text-zinc-200 truncate max-w-[150px]">
                            {p.teamName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* GAME PLAN SCREENSHOT DISPLAY */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                        Official Game Plan
                      </span>

                      {p.gamePlanScreenshotUrl ? (
                        <div
                          onClick={() => setSelectedGamePlan({ url: p.gamePlanScreenshotUrl, name: p.displayName, gamerId: p.efFootballId })}
                          className="relative rounded-xl overflow-hidden border border-zinc-800 group/img cursor-pointer bg-zinc-950 aspect-video flex items-center justify-center hover:border-[#FFD600]/60 transition-colors"
                        >
                          <img
                            src={p.gamePlanScreenshotUrl}
                            alt={`${p.displayName}'s Game Plan`}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-[#FFD600]">
                            <Eye className="w-4 h-4" />
                            <span>Click to Zoom</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800/60 text-center text-xs text-zinc-500">
                          Game plan verified by referee
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Card Action Link */}
                  {p.gamePlanScreenshotUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedGamePlan({ url: p.gamePlanScreenshotUrl, name: p.displayName, gamerId: p.efFootballId })}
                      className="mt-4 w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-[#FFD600]/10 border border-zinc-800 hover:border-[#FFD600]/40 text-xs font-bold text-[#FFD600] flex items-center justify-center gap-2 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      VIEW FULL GAME PLAN
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="p-12 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
              {searchQuery ? 'NO MATCHING CONTESTANTS' : 'NO CONFIRMED PARTICIPANTS YET'}
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {searchQuery
                ? `No approved participants match "${searchQuery}". Try searching for another name or gamer ID.`
                : `Registrations are currently open for ${TOURNAMENT_CONFIG.tournamentName}! Submitted participants will appear here once their payments and game plans are verified by the tournament marshals.`}
            </p>
            {!searchQuery && (
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-xs uppercase tracking-wider shadow-yellow-glow"
                >
                  REGISTER NOW (₹{TOURNAMENT_CONFIG.registrationFee})
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

      </div>

      {/* GAME PLAN ENLARGED MODAL LIGHTBOX */}
      {selectedGamePlan && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedGamePlan(null)}
        >
          <div
            className="max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#FFD600] tracking-widest block">
                  VERIFIED SQUAD GAME PLAN
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {selectedGamePlan.name}{' '}
                  <span className="text-xs font-mono font-normal text-zinc-400">
                    ({selectedGamePlan.gamerId})
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGamePlan(null)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="p-4 bg-zinc-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={selectedGamePlan.url}
                alt={`${selectedGamePlan.name}'s Full Game Plan`}
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-zinc-800"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Official submission for {TOURNAMENT_CONFIG.tournamentName}</span>
              <button
                type="button"
                onClick={() => setSelectedGamePlan(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ParticipantsPage;
