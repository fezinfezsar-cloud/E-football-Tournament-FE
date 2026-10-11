import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  TOURNAMENT_CONFIG,
  SQUAD_RULES,
  GENERAL_RULES,
  MATCH_RULES,
  CONDUCT_RULES
} from '../config/tournamentConfig';
import {
  ShieldAlert,
  Gamepad2,
  Swords,
  CreditCard,
  UserX,
  CheckSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const normalizeSquadRules = (rawSquad) => {
  if (!Array.isArray(rawSquad) || rawSquad.length === 0) {
    return SQUAD_RULES;
  }
  return rawSquad.map((rule, idx) => {
    const fallback = SQUAD_RULES[idx] || {
      title: `Rule ${idx + 1}`,
      text: '',
      badge: `Rule ${idx + 1}`
    };

    if (rule && typeof rule === 'object') {
      const title = rule.title || fallback.title;
      const text = rule.text || rule.description || fallback.text;
      const badge = rule.badge || fallback.badge;
      return { title, text, badge };
    }

    if (typeof rule === 'string' && rule.trim().length > 0) {
      const colonIdx = rule.indexOf(':');
      if (colonIdx !== -1) {
        return {
          title: rule.slice(0, colonIdx).trim(),
          text: rule.slice(colonIdx + 1).trim(),
          badge: fallback.badge
        };
      }
      return {
        title: fallback.title,
        text: rule.trim(),
        badge: fallback.badge
      };
    }

    return fallback;
  });
};

const RulesPage = () => {
  const [rulesData, setRulesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const { data } = await API.get('/tournament/rules');
        if (data && data.rules) {
          setRulesData(data.rules);
        }
      } catch (err) {
        console.warn('Using local rules config fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  const squadRulesList = normalizeSquadRules(rulesData?.squad);

  const generalRulesList = Array.isArray(rulesData?.general) && rulesData.general.length > 0
    ? rulesData.general
    : GENERAL_RULES;

  const matchRulesList = Array.isArray(rulesData?.match) && rulesData.match.length > 0
    ? rulesData.match
    : MATCH_RULES;

  const conductRulesList = Array.isArray(rulesData?.conduct) && rulesData.conduct.length > 0
    ? rulesData.conduct
    : CONDUCT_RULES;

  const paymentRulesList = Array.isArray(rulesData?.payment) && rulesData.payment.length > 0
    ? rulesData.payment
    : [
        `Registration fee is non-refundable (₹${TOURNAMENT_CONFIG.registrationFee} per participant).`,
        `${TOURNAMENT_CONFIG.prizeDescription}`,
        `UPI ID for payment: ${TOURNAMENT_CONFIG.upiId}`,
        "Valid payment screenshot with clear UTR/Transaction reference number is mandatory.",
        "Uploads with fake or reused payment screenshots will result in account ban."
      ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/30 text-xs font-bold text-[#FFD600] mb-4">
            <Sparkles className="w-4 h-4" />
            {TOURNAMENT_CONFIG.tournamentName} • CODE & GUIDELINES
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-2">
            RULES & <span className="text-[#FFD600]">REGULATIONS</span>
          </h1>
          <p className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#FFD600] mb-4">
            E-Football Tournament
          </p>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
            Please read the rules thoroughly before proceeding with your tournament registration for <strong className="text-white">{TOURNAMENT_CONFIG.tournamentName}</strong> at {TOURNAMENT_CONFIG.venue} on {TOURNAMENT_CONFIG.eventDate}.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="space-y-8">
          
          {/* Section 1: General Rules */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white tracking-wide">
                1. General Tournament Rules (Mobile Only)
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              {generalRulesList.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFD600] mt-2 shrink-0"></span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Squad & Team Strength Requirements (Mandatory 4 Rules) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-[#FFD600]/40 shadow-yellow-glow/10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD600] text-black font-extrabold flex items-center justify-center shadow-yellow-glow text-lg">
                  ⚡
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white tracking-wide">
                    2. Squad & Game Plan Regulations
                  </h2>
                  <span className="text-xs text-[#FFD600] font-semibold">Strictly enforced before every match</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {squadRulesList.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#FFD600]/50 transition-all flex flex-col justify-between gap-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-[#FFD600] tracking-wide">
                      {rule.title}
                    </h3>
                    {rule.badge && (
                      <span className="shrink-0 px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30 font-mono">
                        {rule.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Match Rules */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600]">
                <Swords className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white tracking-wide">
                3. Match Settings & Disconnections
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              {matchRulesList.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFD600] mt-2 shrink-0"></span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Conduct & Fair Play */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white tracking-wide">
                4. Player Conduct & Ethics
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              {conductRulesList.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFD600] mt-2 shrink-0"></span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Payment & Verification */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white tracking-wide">
                5. Payment & Verification Policy
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              {paymentRulesList.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFD600] mt-2 shrink-0"></span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 6: Disqualification Grounds */}
          <div className="p-6 sm:p-8 rounded-2xl bg-red-950/20 border border-red-900/40">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-900/40">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <UserX className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-red-400 tracking-wide">
                6. Immediate Disqualification Criteria
              </h2>
            </div>
            <p className="text-xs text-red-300 mb-4 font-semibold uppercase tracking-wider">
              A player will be immediately disqualified without refund for:
            </p>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Submitting fraudulent payment transaction screenshots.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Playing on non-mobile emulators or unapproved platforms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Failing to report within 15 minutes of scheduled match time at {TOURNAMENT_CONFIG.venue}.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Using unapproved game mods, lag switches, or network manipulation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Unsportsmanlike toxicity or verbal abuse towards opponents or marshals.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Action button */}
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-base transition-all shadow-yellow-glow"
          >
            <CheckSquare className="w-5 h-5" />
            PROCEED TO REGISTRATION
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RulesPage;
