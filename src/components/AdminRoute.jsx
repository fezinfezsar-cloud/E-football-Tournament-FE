import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Verifying Admin Privileges..." />;
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-red-500/10">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold font-display tracking-wide text-white mb-3">
          403 — Unauthorized Access
        </h1>
        <p className="text-zinc-400 max-w-md mb-8 leading-relaxed">
          You do not have administrator privileges to view this page. This area is strictly restricted to tournament officials.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-all border border-zinc-700"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-bold transition-all shadow-yellow-glow"
          >
            <LogIn className="w-4 h-4" />
            Admin Portal Login
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
