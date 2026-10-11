import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Shield, Mail, Phone, MapPin, Gamepad } from 'lucide-react';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';

const Footer = () => {
  return (
    <footer className="bg-[#050507] border-t border-zinc-800/80 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD600] flex items-center justify-center text-black font-bold shadow-yellow-glow">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-black text-white tracking-wide">
                {TOURNAMENT_CONFIG.tournamentName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Official eSports Championship for {TOURNAMENT_CONFIG.techfestName}. Showcase your virtual football skills, compete with top gamers, and take home glory & prizes!
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30">
                Prize Pool: {TOURNAMENT_CONFIG.prizePool}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-display text-lg font-bold mb-4 tracking-wider text-zinc-200">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-[#FFD600] transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/participants" className="hover:text-[#FFD600] transition-colors">
                  Participants
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-[#FFD600] transition-colors">
                  Rules & Regulations
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FFD600] transition-colors">
                  Tournament Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FFD600] transition-colors">
                  Participant Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-[#FFD600] transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Event Info */}
          <div>
            <h4 className="text-white font-display text-lg font-bold mb-4 tracking-wider text-zinc-200">
              Tournament Info
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFD600] shrink-0 mt-0.5" />
                <span>{TOURNAMENT_CONFIG.venue}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFD600] shrink-0" />
                <a
                  href={`tel:${TOURNAMENT_CONFIG.contactPhone.replace(/\s+/g, '')}`}
                  className="hover:text-[#FFD600] transition-colors"
                >
                  {TOURNAMENT_CONFIG.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFD600] shrink-0" />
                <a
                  href={`mailto:${TOURNAMENT_CONFIG.contactEmail}`}
                  className="hover:text-[#FFD600] transition-colors break-all"
                >
                  {TOURNAMENT_CONFIG.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Gamepad className="w-4 h-4 text-[#FFD600] shrink-0" />
                <span>{TOURNAMENT_CONFIG.gameDetails.platforms}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Admin Security Portal Link */}
          <div>
            <h4 className="text-white font-display text-lg font-bold mb-4 tracking-wider text-zinc-200">
              Organizer Portal
            </h4>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Restricted area for techfest marshals and verification administrators.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-[#FFD600] border border-zinc-800 hover:border-[#FFD600]/40 transition-all"
            >
              <Shield className="w-4 h-4 text-[#FFD600]" />
              Admin Portal
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 {TOURNAMENT_CONFIG.techfestName} E-Football Committee. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-zinc-400 transition-colors">Terms of Service</span>
            <span className="hover:text-zinc-400 transition-colors">Fair Play Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
