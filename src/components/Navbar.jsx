import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Trophy,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  UserPlus,
  LogIn,
  LayoutDashboard,
  CheckSquare
} from 'lucide-react';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';

const Navbar = () => {
  const { isAuthenticated, isAdmin, isParticipant, user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FFD600] flex items-center justify-center text-black font-bold shadow-yellow-glow group-hover:scale-105 transition-transform duration-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black tracking-wider text-white group-hover:text-[#FFD600] transition-colors leading-none">
                {TOURNAMENT_CONFIG.tournamentName}
              </span>
              <span className="text-[11px] font-semibold text-[#FFD600] tracking-widest uppercase">
                {TOURNAMENT_CONFIG.techfestName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/')
                  ? 'bg-zinc-800 text-[#FFD600] border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Home
            </Link>

            <Link
              to="/rules"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/rules')
                  ? 'bg-zinc-800 text-[#FFD600] border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Rules
            </Link>

            <Link
              to="/participants"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/participants')
                  ? 'bg-zinc-800 text-[#FFD600] border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Participants
            </Link>

            {/* Participant Specific Links */}
            {!isAdmin && (
              <Link
                to="/register"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/register')
                    ? 'bg-zinc-800 text-[#FFD600] border border-zinc-700'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Register
              </Link>
            )}

            {isAuthenticated && isParticipant && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  isActive('/dashboard')
                    ? 'bg-zinc-800 text-[#FFD600] border border-zinc-700'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#FFD600]" />
                My Registration
              </Link>
            )}

            {/* Admin Specific Links - Strictly Hidden from Participants */}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  isActive('/admin/dashboard')
                    ? 'bg-[#FFD600]/20 text-[#FFD600] border border-[#FFD600]/40'
                    : 'text-[#FFD600] hover:bg-[#FFD600]/10'
                }`}
              >
                <Shield className="w-4 h-4 text-[#FFD600]" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                  <User className="w-3.5 h-3.5 text-[#FFD600]" />
                  <span className="font-semibold text-zinc-200">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  {isAdmin && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-[#FFD600] text-black font-extrabold rounded">
                      ADMIN
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-red-500/10 hover:text-red-400 text-zinc-300 border border-zinc-800 hover:border-red-500/30 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-[#FFD600] hover:bg-[#FFE033] text-black transition-all shadow-yellow-glow flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#FFD600]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090b] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-[#FFD600]"
          >
            Home
          </Link>
          <Link
            to="/rules"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-[#FFD600]"
          >
            Rules & Regulations
          </Link>
          <Link
            to="/participants"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-[#FFD600]"
          >
            Participants
          </Link>

          {!isAdmin && (
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-[#FFD600]"
            >
              Tournament Registration
            </Link>
          )}

          {isAuthenticated && isParticipant && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-[#FFD600]"
            >
              My Dashboard
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-[#FFD600] bg-[#FFD600]/10 border border-[#FFD600]/30"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout ({user?.fullName})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-center font-semibold text-white bg-zinc-900 border border-zinc-800"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-center font-bold text-black bg-[#FFD600] shadow-yellow-glow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
