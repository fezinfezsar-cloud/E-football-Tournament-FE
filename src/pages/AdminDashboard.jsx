import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Shield,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Check,
  X,
  FileText,
  Building,
  Gamepad,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Smartphone,
  CreditCard,
  Save,
  Trophy
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    maxParticipants: 32,
    activeCount: 0,
    isFull: false
  });

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');

  // Selected Registration Modal View
  const [selectedReg, setSelectedReg] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [loadingScreenshot, setLoadingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState('');

  useEffect(() => {
    if (selectedReg && (selectedReg.cloudinaryPublicId || selectedReg.paymentScreenshot)) {
      setLoadingScreenshot(true);
      setScreenshotError('');
      API.get(`/admin/registrations/${selectedReg._id}/screenshot`)
        .then((res) => {
          setScreenshotUrl(res.data.url);
        })
        .catch((err) => {
          console.error('Error fetching admin screenshot URL:', err);
          const msg = err.response?.data?.message || 'Could not generate secure viewing link for screenshot.';
          setScreenshotError(msg);
          setScreenshotUrl('');
        })
        .finally(() => {
          setLoadingScreenshot(false);
        });
    } else {
      setScreenshotUrl('');
      setScreenshotError('');
    }
  }, [selectedReg]);
  
  // Rejection Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Payment Settings State
  const [activeUpiId, setActiveUpiId] = useState('');
  const [upiInput, setUpiInput] = useState('');
  const [savingUpi, setSavingUpi] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Fetch payment settings
  const fetchPaymentSettings = async () => {
    try {
      const { data } = await API.get('/admin/payment-settings');
      if (data && data.upiId) {
        setActiveUpiId(data.upiId);
        setUpiInput(data.upiId);
      }
    } catch (err) {
      console.error('Error fetching admin payment settings:', err);
    }
  };

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const handleSaveUpiId = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    const trimmed = upiInput.trim();
    if (!trimmed) {
      setSettingsError('UPI ID cannot be empty.');
      return;
    }

    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9.\-_]{2,64}$/;
    if (!upiRegex.test(trimmed)) {
      setSettingsError('Invalid UPI ID format. Please enter a valid UPI handle (e.g. techfest@upi or 9074268400@paytm).');
      return;
    }

    setSavingUpi(true);
    try {
      const { data } = await API.put('/admin/payment-settings', { upiId: trimmed });
      setActiveUpiId(data.settings.upiId);
      setUpiInput(data.settings.upiId);
      setSettingsSuccess('Payment UPI ID updated successfully!');
      showToast('Payment UPI ID updated successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update payment settings.';
      setSettingsError(msg);
      showToast(msg, 'error');
    } finally {
      setSavingUpi(false);
    }
  };

  // Fetch stats and registrations from API
  const fetchData = async () => {
    try {
      const [statsRes, regRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/registrations', {
          params: {
            search,
            status: statusFilter,
            sort: sortOrder
          }
        })
      ]);

      setStats(statsRes.data);
      setRegistrations(regRes.data);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
      showToast('Failed to fetch registrations data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, sortOrder]);

  // Handle Approve Action
  const handleApprove = async (id) => {
    setIsProcessingAction(true);
    try {
      const { data } = await API.patch(`/admin/registrations/${id}/approve`);
      showToast(`Registration ${data.registration.registrationId} APPROVED successfully!`, 'success');
      
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? data.registration : r))
      );
      if (selectedReg && selectedReg._id === id) {
        setSelectedReg(data.registration);
      }
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to approve registration.';
      showToast(msg, 'error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Open Reject Modal
  const openRejectModal = (reg) => {
    setSelectedReg(reg);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  // Submit Rejection Action
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showToast('Please enter a rejection reason.', 'error');
      return;
    }

    setIsProcessingAction(true);
    try {
      const { data } = await API.patch(
        `/admin/registrations/${selectedReg._id}/reject`,
        { rejectionReason: rejectionReason.trim() }
      );

      showToast(`Registration ${data.registration.registrationId} marked as REJECTED.`, 'info');

      setRegistrations((prev) =>
        prev.map((r) => (r._id === selectedReg._id ? data.registration : r))
      );
      setSelectedReg(data.registration);
      setRejectModalOpen(false);
      setRejectionReason('');
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reject registration.';
      showToast(msg, 'error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading Admin Operations Console..." />;
  }

  const activeParticipants = stats.activeCount || registrations.filter(r => r.registrationStatus !== 'REJECTED').length;
  const isCapacityFull = activeParticipants >= 32;

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFD600] text-black font-extrabold flex items-center justify-center shadow-yellow-glow">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white">
                {TOURNAMENT_CONFIG.tournamentName} — <span className="text-[#FFD600]">ADMIN PANEL</span>
              </h1>
              <p className="text-xs text-zinc-400">
                Logged in as <strong className="text-white">{user?.email}</strong> (System Marshal)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30">
              Live Verification Active
            </span>
            {isCapacityFull ? (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/40">
                REGISTRATION FULL (32 / 32)
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Seats Available ({activeParticipants} / 32)
              </span>
            )}
          </div>
        </div>

        {/* TOURNAMENT CONFIG DETAILS HEADER */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div>
            <span className="text-zinc-500 uppercase font-bold block text-[10px]">Tournament Name</span>
            <span className="font-bold text-[#FFD600]">{TOURNAMENT_CONFIG.tournamentName}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase font-bold block text-[10px]">Date</span>
            <span className="font-bold text-white">{TOURNAMENT_CONFIG.eventDate}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase font-bold block text-[10px]">Venue</span>
            <span className="font-bold text-white">{TOURNAMENT_CONFIG.venue}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase font-bold block text-[10px]">Platform</span>
            <span className="font-bold text-white">Mobile Only</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase font-bold block text-[10px]">Entry Fee</span>
            <span className="font-extrabold text-[#FFD600]">₹{TOURNAMENT_CONFIG.registrationFee}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase font-bold block text-[10px]">Prize Pool</span>
            <span className="font-extrabold text-[#FFD600]">{TOURNAMENT_CONFIG.prizePool}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase font-bold block text-[10px]">Max Participants</span>
            <span className="font-extrabold text-[#FFD600]">{activeParticipants} / 32 Seats</span>
          </div>
        </div>

        {/* STATISTICS SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Capacity Status */}
          <div className={`p-6 rounded-2xl border space-y-2 ${isCapacityFull ? 'bg-red-500/10 border-red-500/40' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs uppercase font-bold tracking-wider">Capacity Limit</span>
              <Smartphone className="w-5 h-5 text-[#FFD600]" />
            </div>
            <div className="text-3xl font-extrabold font-display text-white">
              {activeParticipants} / 32
            </div>
            <p className="text-[11px] text-zinc-400">
              {isCapacityFull ? 'REGISTRATION FULL' : `${32 - activeParticipants} seats available`}
            </p>
          </div>

          {/* Card 2: Total Registrations */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs uppercase font-bold tracking-wider">Total Submissions</span>
              <Users className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-3xl font-extrabold font-display text-white">
              {stats.totalRegistrations}
            </div>
            <p className="text-[11px] text-zinc-500">All participant entries</p>
          </div>

          {/* Card 3: Pending Verification */}
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs uppercase font-bold tracking-wider">Pending Review</span>
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div className="text-3xl font-extrabold font-display text-amber-400">
              {stats.pendingCount}
            </div>
            <p className="text-[11px] text-amber-300/70">Awaiting verification</p>
          </div>

          {/* Card 4: Approved */}
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs uppercase font-bold tracking-wider">Approved Slots</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold font-display text-emerald-400">
              {stats.approvedCount}
            </div>
            <p className="text-[11px] text-emerald-300/70">Confirmed entries</p>
          </div>

          {/* Card 5: Rejected */}
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
            <div className="flex items-center justify-between text-red-400">
              <span className="text-xs uppercase font-bold tracking-wider">Rejected Entries</span>
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-extrabold font-display text-red-400">
              {stats.rejectedCount}
            </div>
            <p className="text-[11px] text-red-300/70">Rejected screenshots</p>
          </div>

        </div>

        {/* PRIZE POOL & FINANCIAL COLLECTION OVERVIEW */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white tracking-wide">
                  Prize Pool & Financial Collection Overview
                </h3>
                <p className="text-xs text-zinc-400">
                  Transparent breakdown of entry fee collection versus allocated tournament prizes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Prize Funding:</span>
              {(stats.approvedCount || 0) * (TOURNAMENT_CONFIG.registrationFee || 50) >= 1400 ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Prize Pool Fully Covered
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  In Progress: ₹{(stats.approvedCount || 0) * (TOURNAMENT_CONFIG.registrationFee || 50)} / ₹1,400 needed
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 uppercase font-bold block text-[10px]">Actual Confirmed Collection</span>
              <div className="text-2xl font-bold font-display text-emerald-400">
                ₹{(stats.approvedCount || 0) * (TOURNAMENT_CONFIG.registrationFee || 50)}
              </div>
              <p className="text-[11px] text-zinc-500">
                {stats.approvedCount || 0} confirmed seats × ₹{TOURNAMENT_CONFIG.registrationFee || 50}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 uppercase font-bold block text-[10px]">Maximum Possible Collection</span>
              <div className="text-2xl font-bold font-display text-white">
                ₹{32 * (TOURNAMENT_CONFIG.registrationFee || 50)}
              </div>
              <p className="text-[11px] text-zinc-500">
                Full 32 participants × ₹{TOURNAMENT_CONFIG.registrationFee || 50} entry fee
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 uppercase font-bold block text-[10px]">Total Prize Money</span>
              <div className="text-2xl font-bold font-display text-[#FFD600]">
                {TOURNAMENT_CONFIG.prizePool}
              </div>
              <p className="text-[11px] text-zinc-500">
                1st Place: ₹1,000 • 2nd Place: ₹400 (Cash only)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 uppercase font-bold block text-[10px]">Event Expense Reserve</span>
              <div className="text-2xl font-bold font-display text-zinc-300">
                ₹200
              </div>
              <p className="text-[11px] text-zinc-500">
                Remaining buffer at full capacity (₹1,600 − ₹1,400)
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>• <strong>Notice:</strong> Cash prizes are awarded for <strong>1st place (₹1,000)</strong> and <strong>2nd place (₹400)</strong> only. No 3rd place prizes or medals.</span>
            <span className="text-zinc-500 shrink-0">32 Max Capacity Enforced</span>
          </div>
        </div>

        {/* PAYMENT SETTINGS SECTION */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white tracking-wide">
                  Payment Settings
                </h3>
                <p className="text-xs text-zinc-400">
                  Configure the active UPI ID used for participant registrations, payment instructions, and QR codes
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FFD600]/10 border border-[#FFD600]/30 text-xs">
                <span className="text-zinc-400 font-semibold">Entry Fee:</span>
                <span className="font-extrabold text-[#FFD600]">₹{TOURNAMENT_CONFIG.registrationFee}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Currently Active:</span>
                <span className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs font-bold text-[#FFD600]">
                  {activeUpiId || 'Not Configured'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveUpiId} className="space-y-4">
            {settingsError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{settingsError}</span>
              </div>
            )}
            {settingsSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label htmlFor="adminUpiInput" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  UPI ID <span className="text-[#FFD600]">*</span>
                </label>
                <input
                  id="adminUpiInput"
                  type="text"
                  value={upiInput}
                  onChange={(e) => {
                    setUpiInput(e.target.value);
                    setSettingsError('');
                    setSettingsSuccess('');
                  }}
                  placeholder="e.g. techfest.efootball@upi or 9074268400@paytm"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] transition-colors"
                />
              </div>
              <button
                type="submit"
                id="saveUpiBtn"
                disabled={savingUpi}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-yellow-glow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {savingUpi ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">
              * Updating the UPI ID immediately updates the participant payment screen, copy button, and payment QR code without needing a server restart or deployment.
            </p>
          </form>
        </div>

        {/* SEARCH, FILTER & SORTING CONTROLS */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Name, Email, Reg ID, Gamer ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#FFD600] shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#FFD600] text-sm cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Verification</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#FFD600] shrink-0" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#FFD600] text-sm cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

          </div>
        </div>

        {/* REGISTRATIONS TABLE */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-white uppercase tracking-wide">
              PARTICIPANT REGISTRATION RECORDS ({registrations.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 text-xs uppercase text-zinc-400 font-bold border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-6">Reg ID</th>
                  <th className="py-4 px-6">Participant</th>
                  <th className="py-4 px-6">College</th>
                  <th className="py-4 px-6">E-Football Mobile ID</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-zinc-500">
                      No tournament registrations match your current search/filter criteria.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-zinc-800/40 transition-colors">
                      
                      {/* Reg ID */}
                      <td className="py-4 px-6 font-mono font-bold text-[#FFD600]">
                        {reg.registrationId}
                      </td>

                      {/* Participant Details */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{reg.fullName}</div>
                        <div className="text-xs text-zinc-400">{reg.email}</div>
                        <div className="text-[11px] text-zinc-500">{reg.phone}</div>
                      </td>

                      {/* College */}
                      <td className="py-4 px-6 text-zinc-300 font-medium">
                        {reg.college}
                      </td>

                      {/* Gamer ID */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs font-bold text-white">
                          {reg.efFootballId}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <StatusBadge status={reg.registrationStatus} />
                      </td>

                      {/* Submitted Date */}
                      <td className="py-4 px-6 text-xs text-zinc-400">
                        {reg.submittedAt
                          ? new Date(reg.submittedAt).toLocaleDateString()
                          : new Date(reg.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* View Modal */}
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                            title="View Full Details & Screenshot"
                          >
                            <Eye className="w-4 h-4 text-[#FFD600]" />
                          </button>

                          {/* Quick Approve */}
                          {reg.registrationStatus !== 'APPROVED' && (
                            <button
                              onClick={() => handleApprove(reg._id)}
                              disabled={isProcessingAction}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1"
                              title="Approve Payment"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          )}

                          {/* Quick Reject */}
                          {reg.registrationStatus !== 'REJECTED' && (
                            <button
                              onClick={() => openRejectModal(reg)}
                              disabled={isProcessingAction}
                              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1"
                              title="Reject Payment"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* REGISTRATION DETAIL & SCREENSHOT REVIEW MODAL */}
        {selectedReg && !rejectModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl my-8">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                <div>
                  <span className="text-xs font-bold text-[#FFD600] uppercase">
                    REGISTRATION REVIEW
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {selectedReg.registrationId}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">Participant Name</span>
                    <span className="font-bold text-white text-sm">{selectedReg.fullName}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">Email Address</span>
                    <span className="font-bold text-white text-sm">{selectedReg.email}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">Phone Number</span>
                    <span className="font-bold text-white text-sm">{selectedReg.phone}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">College / Institution</span>
                    <span className="font-bold text-white text-sm">{selectedReg.college}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">E-Football Mobile Gamer ID</span>
                    <span className="font-bold text-[#FFD600] font-mono text-sm">{selectedReg.efFootballId}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">Registration Status</span>
                    <div className="mt-1">
                      <StatusBadge status={selectedReg.registrationStatus} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">Entry Fee</span>
                    <span className="font-bold text-[#FFD600] text-sm">₹{TOURNAMENT_CONFIG.registrationFee}</span>
                  </div>

                  {selectedReg.teamName && (
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-zinc-500 uppercase font-bold block text-[10px]">Squad / Team</span>
                      <span className="font-bold text-white text-sm">{selectedReg.teamName}</span>
                    </div>
                  )}
                </div>

                {/* Rejection Reason if any */}
                {selectedReg.rejectionReason && (
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-xs text-red-300">
                    <strong className="block font-bold text-red-400 uppercase mb-1">
                      Current Rejection Reason:
                    </strong>
                    "{selectedReg.rejectionReason}"
                  </div>
                )}

                {/* Uploaded Payment Screenshot Section */}
                <div className="space-y-3 border-t border-zinc-800 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                    Uploaded Payment Screenshot Proof (Private):
                  </span>

                  {loadingScreenshot ? (
                    <div className="p-8 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-zinc-400 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#FFD600] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold">Generating secure viewing token...</span>
                    </div>
                  ) : screenshotError ? (
                    <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-xs text-center">
                      {screenshotError}
                    </div>
                  ) : screenshotUrl ? (
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                      <a
                        href={screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block relative group"
                      >
                        <img
                          src={screenshotUrl}
                          alt="Payment Screenshot Proof"
                          className="max-h-80 mx-auto rounded-lg border border-zinc-700 shadow-xl object-contain hover:opacity-95 transition-opacity"
                        />
                        <span className="mt-2 text-xs text-[#FFD600] font-bold flex items-center justify-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Click to open image full size in new tab (Signed Cloudinary URL)
                        </span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-zinc-500 text-xs">
                      No payment screenshot uploaded yet.
                    </div>
                  )}
                </div>

                {/* Uploaded Game Plan Screenshot Section */}
                <div className="space-y-3 border-t border-zinc-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                      Uploaded E-Football Game Plan Screenshot:
                    </span>
                    <span className="text-[10px] text-[#FFD600] font-semibold">
                      Verify Squad: Strength ≤ 3200 &amp; Standard Rating &gt; 95
                    </span>
                  </div>

                  {selectedReg.gamePlanScreenshotUrl || selectedReg.gamePlanScreenshot ? (
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                      <a
                        href={selectedReg.gamePlanScreenshotUrl || selectedReg.gamePlanScreenshot}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block relative group"
                      >
                        <img
                          src={selectedReg.gamePlanScreenshotUrl || selectedReg.gamePlanScreenshot}
                          alt="Game Plan Screenshot Proof"
                          className="max-h-80 mx-auto rounded-lg border border-zinc-700 shadow-xl object-contain hover:opacity-95 transition-opacity"
                        />
                        <span className="mt-2 text-xs text-[#FFD600] font-bold flex items-center justify-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Click to open Game Plan in new tab
                        </span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-zinc-500 text-xs">
                      No game plan screenshot uploaded for this registration.
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedReg(null)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs"
                >
                  Close
                </button>

                <button
                  onClick={() => openRejectModal(selectedReg)}
                  disabled={isProcessingAction}
                  className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs uppercase transition-all flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Reject Payment
                </button>

                <button
                  onClick={() => handleApprove(selectedReg._id)}
                  disabled={isProcessingAction}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  Approve Payment
                </button>
              </div>

            </div>
          </div>
        )}

        {/* REJECTION REASON INPUT MODAL */}
        {rejectModalOpen && selectedReg && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 max-w-lg w-full rounded-2xl p-6 space-y-6 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-display text-xl font-bold text-red-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  REJECT PAYMENT SCREENSHOT
                </h3>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Please enter a clear reason for rejecting the payment for participant{' '}
                <strong className="text-white">{selectedReg.fullName}</strong> ({selectedReg.registrationId}). This reason will be displayed on their dashboard.
              </p>

              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    Reason for Rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    placeholder="e.g. Transaction ID / UTR number not visible in screenshot, or amount paid does not match entry fee."
                    required
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 text-sm"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessingAction || !rejectionReason.trim()}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isProcessingAction ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Confirm Rejection
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
