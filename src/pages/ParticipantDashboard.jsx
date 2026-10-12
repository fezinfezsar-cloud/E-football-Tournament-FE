import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  Trophy,
  Gamepad,
  Building,
  Upload,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  PlusCircle,
  Eye,
  Users,
  X
} from 'lucide-react';

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gamePlanModalOpen, setGamePlanModalOpen] = useState(false);

  // Resubmission state (when rejected)
  const [resubmitFile, setResubmitFile] = useState(null);
  const [resubmitPreview, setResubmitPreview] = useState('');
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmitError, setResubmitError] = useState('');

  const fetchRegistration = async () => {
    try {
      const { data } = await API.get('/registrations/my');
      setRegistration(data);
    } catch (err) {
      console.error('Error loading registration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistration();
  }, []);

  const [signedScreenshotUrl, setSignedScreenshotUrl] = useState('');

  useEffect(() => {
    if (registration && (registration.cloudinaryPublicId || registration.paymentScreenshot)) {
      API.get(`/registrations/${registration._id}/screenshot`)
        .then((res) => {
          setSignedScreenshotUrl(res.data.url);
        })
        .catch((err) => {
          console.error('Failed to fetch participant screenshot URL:', err);
          setSignedScreenshotUrl('');
        });
    } else {
      setSignedScreenshotUrl('');
    }
  }, [registration]);

  // Handle File selection for payment resubmission
  const handleResubmitFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setResubmitError('File size must be less than 5 MB.');
      showToast('File size exceeds 5 MB limit.', 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setResubmitError('Only JPG, JPEG, PNG, and WebP images are allowed.');
      showToast('Invalid file format.', 'error');
      return;
    }

    setResubmitError('');
    setResubmitFile(file);
    setResubmitPreview(URL.createObjectURL(file));
  };

  // Submit corrected payment screenshot
  const handleResubmitSubmit = async (e) => {
    e.preventDefault();
    setResubmitError('');

    if (!resubmitFile || !registration) {
      setResubmitError('Please select a new payment screenshot image.');
      return;
    }

    setIsResubmitting(true);

    try {
      const formData = new FormData();
      formData.append('paymentScreenshot', resubmitFile);

      const { data } = await API.post(
        `/registrations/${registration._id}/payment`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      showToast('Corrected payment screenshot resubmitted successfully!', 'success');
      setRegistration(data.registration);
      setResubmitFile(null);
      setResubmitPreview('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resubmit payment screenshot.';
      setResubmitError(msg);
      showToast(msg, 'error');
    } finally {
      setIsResubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Header Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#FFD600]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#FFD600] tracking-widest uppercase">
              PARTICIPANT DASHBOARD
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-white">
              WELCOME, <span className="text-[#FFD600]">{user?.fullName}</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Account Email: {user?.email} • Role: {user?.role}
            </p>
          </div>

          {!registration && (
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-sm uppercase tracking-wider transition-all shadow-yellow-glow flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              REGISTER FOR TOURNAMENT NOW
            </Link>
          )}
        </div>

        {/* PROFILE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600]">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Player Profile
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px]">Full Name</span>
                <span className="font-semibold text-zinc-200 text-sm">{user?.fullName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px]">Email Address</span>
                <span className="font-semibold text-zinc-200 text-sm">{user?.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px]">Phone Number</span>
                <span className="font-semibold text-zinc-200 text-sm">{user?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Registration Details or Empty State */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600]">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Tournament Registration Info
                </h3>
              </div>
              {registration && (
                <StatusBadge status={registration.registrationStatus} type="registration" />
              )}
            </div>

            {registration ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">Registration ID</span>
                    <span className="font-mono text-base font-extrabold text-[#FFD600]">
                      {registration.registrationId}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">E-Football Player / Gamer ID</span>
                    <span className="font-semibold text-white text-sm">
                      {registration.efFootballId}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">College / Institution</span>
                    <span className="font-semibold text-white text-sm">
                      {registration.college}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">Squad / Team Name</span>
                    <span className="font-semibold text-white text-sm">
                      {registration.teamName || 'N/A (Solo Entry)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 uppercase font-bold block text-[10px]">Entry Fee</span>
                    <span className="font-semibold text-[#FFD600] text-sm">
                      ₹{TOURNAMENT_CONFIG.registrationFee}
                    </span>
                  </div>
                </div>

                {/* Game Plan Display */}
                {(registration.gamePlanScreenshotUrl || registration.gamePlanScreenshot) && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] shrink-0">
                        <Gamepad className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs uppercase text-zinc-300 font-bold block">
                          Submitted Game Plan Squad
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          Public profile game-plan image (Team Strength ≤ 3200)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGamePlanModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-[#FFD600]/10 border border-zinc-700 hover:border-[#FFD600]/40 text-xs font-bold text-[#FFD600] flex items-center gap-2 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View Game Plan
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-zinc-400">
                  You haven't registered for the E-Football Championship yet.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFD600] text-black font-bold text-xs uppercase"
                >
                  <PlusCircle className="w-4 h-4" />
                  Start Registration
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* VERIFICATION & PAYMENT STATUS CARDS */}
        {registration && (
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6">
            <h3 className="font-display text-2xl font-bold text-white border-b border-zinc-800 pb-4">
              Payment & Verification Status
            </h3>

            {/* STATUS CASE 1: PENDING VERIFICATION */}
            {registration.registrationStatus === 'PENDING_VERIFICATION' && (
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-amber-400">Payment Status:</span>
                      <StatusBadge status={registration.paymentStatus} type="payment" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-white">
                      ⏳ Pending Admin Verification
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                      Your payment screenshot has been submitted successfully. Please wait while the tournament admin team reviews and verifies your transaction.
                    </p>
                  </div>
                </div>

                {signedScreenshotUrl && (
                  <a
                    href={signedScreenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-2 shrink-0"
                  >
                    <Eye className="w-4 h-4 text-[#FFD600]" />
                    View Submitted Screenshot
                  </a>
                )}
              </div>
            )}

            {/* STATUS CASE 2: APPROVED / VERIFIED */}
            {registration.registrationStatus === 'APPROVED' && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-emerald-400">Payment Status:</span>
                      <StatusBadge status={registration.paymentStatus} type="payment" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-white">
                      ✓ Tournament Registration Confirmed!
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                      Congratulations! Your payment has been verified and your slot in <strong className="text-white">{TOURNAMENT_CONFIG.tournamentName}</strong> is officially confirmed. Please report to <strong>{TOURNAMENT_CONFIG.venue}</strong> on <strong>{TOURNAMENT_CONFIG.eventDate}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <Link
                    to="/participants"
                    className="px-4 py-2.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black text-xs font-extrabold flex items-center gap-2 shadow-yellow-glow"
                  >
                    <Users className="w-4 h-4" />
                    View Public Participants
                  </Link>

                  {signedScreenshotUrl && (
                    <a
                      href={signedScreenshotUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-2 shrink-0"
                    >
                      <Eye className="w-4 h-4 text-[#FFD600]" />
                      View Verified Payment Proof
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* STATUS CASE 3: REJECTED & RESUBMISSION FORM */}
            {registration.registrationStatus === 'REJECTED' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-red-400">Payment Status:</span>
                      <StatusBadge status={registration.paymentStatus} type="payment" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-white">
                      ✕ Payment Rejected by Admin
                    </h4>
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/50 text-xs text-red-300">
                      <strong className="block font-bold text-red-400 uppercase mb-1">
                        Reason for Rejection:
                      </strong>
                      "{registration.rejectionReason || 'Invalid transaction screenshot provided.'}"
                    </div>
                  </div>
                </div>

                {/* RESUBMIT NEW SCREENSHOT FORM */}
                <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                  <h4 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-[#FFD600]" />
                    Upload Corrected Payment Screenshot
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Please make sure your new screenshot clearly displays the UTR / Transaction Reference Number and the correct fee amount (₹{TOURNAMENT_CONFIG.registrationFee}).
                  </p>

                  {resubmitError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{resubmitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleResubmitSubmit} className="space-y-4">
                    <div className="p-4 rounded-xl border-2 border-dashed border-zinc-800 hover:border-[#FFD600]/60 transition-colors bg-zinc-900/50 text-center relative">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleResubmitFileChange}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      {resubmitPreview ? (
                        <div className="space-y-2">
                          <img
                            src={resubmitPreview}
                            alt="New Payment Screenshot"
                            className="max-h-48 mx-auto rounded-lg border border-zinc-700 object-contain"
                          />
                          <p className="text-xs text-[#FFD600] font-semibold">
                            New screenshot selected. Click submit below.
                          </p>
                        </div>
                      ) : (
                        <div className="py-2 space-y-2">
                          <Upload className="w-6 h-6 text-[#FFD600] mx-auto" />
                          <p className="text-xs font-bold text-white">
                            Select New Screenshot File (JPG, PNG, WebP &lt; 5MB)
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isResubmitting || !resubmitFile}
                      className="w-full py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-xs uppercase tracking-wider shadow-yellow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isResubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Resubmitting...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          RESUBMIT PAYMENT SCREENSHOT FOR VERIFICATION
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* GAME PLAN ENLARGED VIEW MODAL */}
      {gamePlanModalOpen && registration && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setGamePlanModalOpen(false)}
        >
          <div
            className="max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#FFD600] tracking-widest block">
                  PARTICIPANT GAME PLAN SCREENSHOT
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {registration.fullName}{' '}
                  <span className="text-xs font-mono font-normal text-zinc-400">
                    ({registration.efFootballId})
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setGamePlanModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={registration.gamePlanScreenshotUrl || registration.gamePlanScreenshot}
                alt="My Game Plan Screenshot"
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-zinc-800"
              />
            </div>

            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Registration ID: {registration.registrationId}</span>
              <button
                type="button"
                onClick={() => setGamePlanModalOpen(false)}
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

export default ParticipantDashboard;
