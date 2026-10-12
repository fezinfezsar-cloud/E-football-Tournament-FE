import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FileText,
  CheckSquare,
  ArrowRight,
  User,
  Mail,
  Phone,
  Building,
  Gamepad,
  Users,
  CreditCard,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Smartphone,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

const TournamentRegistrationFlow = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loadingExisting, setLoadingExisting] = useState(true);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [tournamentInfo, setTournamentInfo] = useState(null);

  // Stepper state: 1 = Rules, 2 = Form, 3 = Payment & Upload, 4 = Complete
  const [step, setStep] = useState(1);

  // Step 1 State: Rules agreement checkbox
  const [rulesAgreed, setRulesAgreed] = useState(false);

  // Step 2 State: Registration Form
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: '',
    efFootballId: '',
    teamName: ''
  });

  // Step 3 State: Payment & Game Plan Files & Previews
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentPreviewUrl, setPaymentPreviewUrl] = useState('');
  const [gamePlanFile, setGamePlanFile] = useState(null);
  const [gamePlanPreviewUrl, setGamePlanPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeUpiId, setActiveUpiId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Fetch registration & tournament info on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [regRes, infoRes, settingsRes] = await Promise.all([
          API.get('/registrations/my'),
          API.get('/tournament/info'),
          API.get('/tournament/payment-settings').catch(() => null)
        ]);

        if (regRes.data) {
          setExistingRegistration(regRes.data);
        }
        if (infoRes.data) {
          setTournamentInfo(infoRes.data);
          if (infoRes.data.upiId) {
            setActiveUpiId(infoRes.data.upiId);
          }
        }
        if (settingsRes?.data?.upiId) {
          setActiveUpiId(settingsRes.data.upiId);
        }
      } catch (err) {
        console.error('Error fetching registration flow data:', err);
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCopyUpi = () => {
    const upiToCopy = activeUpiId || tournamentInfo?.upiId || TOURNAMENT_CONFIG.upiId;
    if (upiToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(upiToCopy);
      setCopiedUpi(true);
      showToast('UPI ID copied to clipboard!', 'success');
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  // Sync user details into form data when available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // Handle Form Change
  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  // Handle Payment Screenshot File Select
  const handlePaymentFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Payment screenshot must be less than 5 MB.');
      showToast('File size exceeds 5 MB limit.', 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, and WebP image files are allowed for payment screenshot.');
      showToast('Invalid file format.', 'error');
      return;
    }

    setError('');
    setPaymentFile(file);
    setPaymentPreviewUrl(URL.createObjectURL(file));
  };

  // Handle Game Plan Screenshot File Select
  const handleGamePlanFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Game Plan screenshot must be less than 5 MB.');
      showToast('File size exceeds 5 MB limit.', 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, and WebP image files are allowed for Game Plan screenshot.');
      showToast('Invalid file format.', 'error');
      return;
    }

    setError('');
    setGamePlanFile(file);
    setGamePlanPreviewUrl(URL.createObjectURL(file));
  };

  // Step 2 Submission -> Move to Payment Step 3
  const handleStep2Submit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.phone || !formData.college || !formData.efFootballId) {
      setError('Please fill in all required registration details.');
      return;
    }

    setStep(3);
  };

  // Final Submission (Form + Payment Screenshot + Game Plan Screenshot) -> API
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!gamePlanFile) {
      setError('Game Plan screenshot is mandatory! Please upload your E-Football Game Plan screenshot.');
      showToast('Game Plan screenshot is required.', 'error');
      return;
    }

    if (!paymentFile) {
      setError('Payment screenshot is mandatory! Please upload your payment confirmation proof.');
      showToast('Payment screenshot is required.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataPayload = new FormData();
      dataPayload.append('fullName', formData.fullName);
      dataPayload.append('phone', formData.phone);
      dataPayload.append('college', formData.college);
      dataPayload.append('efFootballId', formData.efFootballId);
      dataPayload.append('teamName', formData.teamName || '');
      dataPayload.append('rulesAccepted', 'true');
      dataPayload.append('paymentScreenshot', paymentFile);
      dataPayload.append('gamePlanScreenshot', gamePlanFile);

      const { data } = await API.post('/registrations', dataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showToast('Registration, Game Plan, and payment submitted successfully!', 'success');
      setExistingRegistration(data.registration);
      setStep(4);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit registration. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingExisting) {
    return <LoadingSpinner fullScreen message="Loading registration panel..." />;
  }

  // CAPACITY CHECK: If registrations reach 32 and user has no existing registration
  if (!existingRegistration && tournamentInfo?.isFull) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#09090b]">
        <div className="max-w-xl w-full p-8 rounded-2xl bg-zinc-900 border border-amber-500/40 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h2 className="font-display text-4xl font-black uppercase tracking-wide text-[#FFD600] mb-2">
            REGISTRATION FULL
          </h2>

          <p className="text-zinc-300 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            All 32 participant seats for <strong>{TOURNAMENT_CONFIG.tournamentName}</strong> have been filled.
          </p>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-left mb-8 space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between border-b border-zinc-900 pb-2">
              <span>Tournament:</span>
              <span className="font-bold text-white">{TOURNAMENT_CONFIG.tournamentName}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-2">
              <span>Platform:</span>
              <span className="font-bold text-white">Mobile Only</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-2">
              <span>Maximum Capacity:</span>
              <span className="font-bold text-[#FFD600]">32 Participants</span>
            </div>
            <div className="flex justify-between">
              <span>Venue & Date:</span>
              <span className="font-bold text-white">{TOURNAMENT_CONFIG.venue} ({TOURNAMENT_CONFIG.eventDate})</span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm uppercase transition-all"
          >
            RETURN TO HOME PAGE
          </Link>
        </div>
      </div>
    );
  }

  // If user ALREADY HAS an active registration (and it's not rejected), show existing registration status notice
  if (existingRegistration && existingRegistration.registrationStatus !== 'REJECTED') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#09090b]">
        <div className="max-w-xl w-full p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center mx-auto mb-6 text-[#FFD600]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white mb-2">
            REGISTRATION ALREADY SUBMITTED
          </h2>

          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            You have already registered for {TOURNAMENT_CONFIG.tournamentName} under Registration ID{' '}
            <strong className="text-[#FFD600]">{existingRegistration.registrationId}</strong>.
            Multiple active registrations for the same account are not permitted.
          </p>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-left mb-8 space-y-2 text-xs">
            <div className="flex justify-between border-b border-zinc-900 pb-2">
              <span className="text-zinc-400">Gamer / Player ID:</span>
              <span className="font-bold text-white">{existingRegistration.efFootballId}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-2">
              <span className="text-zinc-400">College / Institution:</span>
              <span className="font-bold text-white">{existingRegistration.college}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Verification Status:</span>
              <span className="font-bold text-[#FFD600]">{existingRegistration.registrationStatus}</span>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-sm uppercase transition-all shadow-yellow-glow"
          >
            GO TO MY DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  // If previous registration was REJECTED, prompt user to go to dashboard to resubmit screenshot
  if (existingRegistration && existingRegistration.registrationStatus === 'REJECTED') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#09090b]">
        <div className="max-w-xl w-full p-8 rounded-2xl bg-zinc-900 border border-red-500/30 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
            <RotateCcw className="w-8 h-8" />
          </div>

          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white mb-2">
            PREVIOUS PAYMENT REJECTED
          </h2>

          <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
            Your previous registration payment was rejected by the admin. Please head over to your dashboard to view the rejection reason and upload a corrected payment screenshot.
          </p>

          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-left mb-8 text-xs text-red-300">
            <strong className="block text-red-400 font-bold mb-1">Rejection Reason from Admin:</strong>
            "{existingRegistration.rejectionReason || 'Invalid transaction screenshot'}"
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-sm uppercase transition-all shadow-yellow-glow"
          >
            RESUBMIT PAYMENT SCREENSHOT ON DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Stepper Header Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-0"></div>
            
            {/* Step 1 Indicator */}
            <div className={`flex flex-col items-center gap-2 z-10 ${step >= 1 ? 'text-[#FFD600]' : 'text-zinc-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-display text-base border-2 ${step >= 1 ? 'bg-[#FFD600] text-black border-[#FFD600]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                1
              </div>
              <span className="text-xs font-semibold hidden sm:block">Rules</span>
            </div>

            {/* Step 2 Indicator */}
            <div className={`flex flex-col items-center gap-2 z-10 ${step >= 2 ? 'text-[#FFD600]' : 'text-zinc-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-display text-base border-2 ${step >= 2 ? 'bg-[#FFD600] text-black border-[#FFD600]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                2
              </div>
              <span className="text-xs font-semibold hidden sm:block">Details</span>
            </div>

            {/* Step 3 Indicator */}
            <div className={`flex flex-col items-center gap-2 z-10 ${step >= 3 ? 'text-[#FFD600]' : 'text-zinc-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-display text-base border-2 ${step >= 3 ? 'bg-[#FFD600] text-black border-[#FFD600]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                3
              </div>
              <span className="text-xs font-semibold hidden sm:block">Payment</span>
            </div>

            {/* Step 4 Indicator */}
            <div className={`flex flex-col items-center gap-2 z-10 ${step >= 4 ? 'text-[#FFD600]' : 'text-zinc-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-display text-base border-2 ${step >= 4 ? 'bg-[#FFD600] text-black border-[#FFD600]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                4
              </div>
              <span className="text-xs font-semibold hidden sm:block">Confirmation</span>
            </div>
          </div>
        </div>

        {/* STEP 1: RULES & REGULATIONS COMPULSORY AGREEMENT */}
        {step === 1 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <span className="text-xs font-bold text-[#FFD600] uppercase tracking-wider">STEP 1 OF 3</span>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white mt-1">
                {TOURNAMENT_CONFIG.tournamentName} — RULES & REGULATIONS
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                You must review and agree to the rules before filling out the registration form.
              </p>
            </div>

            {/* Tournament Info Banner */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px]">Tournament</span>
                <span className="font-bold text-[#FFD600]">{TOURNAMENT_CONFIG.tournamentName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px]">Date</span>
                <span className="font-bold text-white">{TOURNAMENT_CONFIG.eventDate}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px]">Venue</span>
                <span className="font-bold text-white">{TOURNAMENT_CONFIG.venue}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px]">Platform</span>
                <span className="font-bold text-white">Mobile Only</span>
              </div>
            </div>

            {/* Scrollable Rules Container */}
            <div className="max-h-80 overflow-y-auto p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4 mb-6 text-xs text-zinc-300 leading-relaxed">
              <h3 className="font-bold text-white uppercase text-sm border-b border-zinc-800 pb-2 text-[#FFD600]">
                Key Tournament Rules Overview
              </h3>
              
              <ul className="space-y-2 list-disc pl-4">
                <li><strong>Tournament:</strong> {TOURNAMENT_CONFIG.tournamentName} (E-Football Tournament)</li>
                <li><strong>Platform:</strong> Mobile Only. All matches must be played strictly on mobile devices.</li>
                <li><strong>Participant Capacity:</strong> 32 Participant Seats Maximum.</li>
                <li><strong>Match Format:</strong> 10-minute matches (5 mins per half). Draw matches go into Extra Time & Penalties.</li>
                <li><strong>Reporting Time:</strong> Participants must report at least 15 minutes before their scheduled slot at {TOURNAMENT_CONFIG.venue}.</li>
                <li><strong>Payment Fee:</strong> Registration fee of ₹{tournamentInfo?.registrationFee || TOURNAMENT_CONFIG.registrationFee} is non-refundable.</li>
                <li><strong>Prize Pool:</strong> {TOURNAMENT_CONFIG.prizeDescription}</li>
                <li><strong>Proof of Payment:</strong> Authentic payment screenshot with transaction reference is strictly required. Fake screenshots will lead to permanent disqualification.</li>
                <li><strong>Rule 1 (Max Team Strength):</strong> Total team strength must be less than or equal to 3200 (≤ 3200). Teams with strength &gt; 3200 are not permitted.</li>
                <li><strong>Rule 2 (Standard Players):</strong> Standard player cards are allowed in the team. Every Standard player must have a rating strictly greater than 95 (&gt; 95). A rating of exactly 95 does not qualify.</li>
                <li><strong>Rule 3 (Progression):</strong> All player cards in the Game Plan must be fully progressed. Non-progressed cards are not allowed.</li>
                <li><strong>Rule 4 (Custom Progression):</strong> Custom progression is allowed, but a player's rating must not decrease by more than 3 points (drop ≤ 3) compared with applicable reference rating.</li>
                <li><strong>Fair Play:</strong> Zero tolerance for cheating, toxic behavior, or glitch exploitation.</li>
              </ul>
            </div>

            {/* Mandatory Checkbox */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 mb-8 flex items-start gap-3">
              <input
                type="checkbox"
                id="rulesCheckbox"
                checked={rulesAgreed}
                onChange={(e) => setRulesAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-zinc-700 text-[#FFD600] focus:ring-[#FFD600] bg-zinc-900 cursor-pointer accent-[#FFD600]"
              />
              <label htmlFor="rulesCheckbox" className="text-sm font-semibold text-zinc-200 cursor-pointer selection:bg-transparent">
                ☑ I have read and agree to all tournament rules, regulations, and fair play requirements.
              </label>
            </div>

            {/* Step 1 Action Button */}
            <button
              onClick={() => setStep(2)}
              disabled={!rulesAgreed}
              className={`w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                rulesAgreed
                  ? 'bg-[#FFD600] hover:bg-[#FFE033] text-black shadow-yellow-glow cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span>CONTINUE TO REGISTRATION FORM</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: REGISTRATION FORM */}
        {step === 2 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <span className="text-xs font-bold text-[#FFD600] uppercase tracking-wider">STEP 2 OF 3</span>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white mt-1">
                PARTICIPANT REGISTRATION DETAILS
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Registering for <strong>{TOURNAMENT_CONFIG.tournamentName}</strong> ({TOURNAMENT_CONFIG.eventDate} @ {TOURNAMENT_CONFIG.venue})
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStep2Submit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Full Name <span className="text-[#FFD600]">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    placeholder="Full Name"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] text-sm"
                  />
                </div>
              </div>

              {/* Email Address (LOCKED to Account Email) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Email Address <span className="text-zinc-500">(Locked to Account)</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    readOnly
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-zinc-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Contact Phone Number <span className="text-[#FFD600]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+91 9074268400"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] text-sm"
                  />
                </div>
              </div>

              {/* College / Institution */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  College / Institution Name <span className="text-[#FFD600]">*</span>
                </label>
                <div className="relative">
                  <Building className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleFormChange}
                    placeholder="e.g. VAST"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] text-sm"
                  />
                </div>
              </div>

              {/* E-Football Mobile Gamer ID / Username */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  E-Football Mobile Gamer / Player ID <span className="text-[#FFD600]">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="efFootballId"
                    value={formData.efFootballId}
                    onChange={handleFormChange}
                    placeholder="e.g. Mobile eFootball Username or Player ID"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] text-sm"
                  />
                </div>
              </div>

              {/* Team Name (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Squad / Clan / Team Name <span className="text-zinc-500">(Optional)</span>
                </label>
                <div className="relative">
                  <Users className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleFormChange}
                    placeholder="e.g. Cyber Strikers"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-sm uppercase tracking-wider shadow-yellow-glow flex items-center justify-center gap-2"
                >
                  PROCEED TO PAYMENT SCREENSHOT
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: PAYMENT INSTRUCTIONS & SCREENSHOT UPLOAD */}
        {step === 3 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <span className="text-xs font-bold text-[#FFD600] uppercase tracking-wider">STEP 3 OF 3</span>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white mt-1">
                PAYMENT & SCREENSHOT SUBMISSION
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Pay the entry fee and upload your payment confirmation proof
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Details Card */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 mb-8 space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div>
                  <span className="text-xs uppercase text-zinc-500 font-bold">Registration Entry Fee</span>
                  <div className="text-3xl font-black font-display text-[#FFD600]">
                    ₹{tournamentInfo?.registrationFee || TOURNAMENT_CONFIG.registrationFee}
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#FFD600]" />
                  UPI PAYMENT
                </div>
              </div>

              {!activeUpiId && !tournamentInfo?.upiId ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-bold block text-sm mb-0.5 text-amber-400">Payment UPI ID Notice</span>
                    <span>The tournament organizers are currently setting up the official UPI ID. Please check back shortly or contact the help desk.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Displayed UPI ID & Copy Button */}
                  <div>
                    <span className="text-xs uppercase text-zinc-500 font-bold block mb-1.5">
                      Official Tournament UPI ID:
                    </span>
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-sm sm:text-base font-bold text-[#FFD600] break-all">
                          {activeUpiId || tournamentInfo?.upiId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30 shrink-0">
                          Active
                        </span>
                      </div>
                      <button
                        type="button"
                        id="copyUpiBtn"
                        onClick={handleCopyUpi}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#FFD600]" />
                            <span>Copy UPI ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic QR Code & Payment Instructions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* QR Code Container */}
                    <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Scan to Pay with Any UPI App
                      </span>
                      <div className="p-2.5 rounded-xl bg-white shadow-xl">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${activeUpiId || tournamentInfo?.upiId}&pn=${encodeURIComponent(TOURNAMENT_CONFIG.tournamentName)}&am=${tournamentInfo?.registrationFee || TOURNAMENT_CONFIG.registrationFee}&cu=INR&tn=${encodeURIComponent('MINI MAYHEM Registration')}`)}`}
                          alt="Tournament UPI Payment QR Code"
                          className="w-36 h-36 mx-auto block"
                        />
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        <span>Preset Amount: </span>
                        <strong className="text-[#FFD600] font-bold">₹{tournamentInfo?.registrationFee || TOURNAMENT_CONFIG.registrationFee}</strong>
                        <span> • GPay / PhonePe / Paytm</span>
                      </div>
                    </div>

                    {/* Step-by-Step Instructions & App Launch */}
                    <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                          UPI Payment Instructions:
                        </span>
                        <ol className="text-xs text-zinc-300 space-y-2 list-decimal pl-4 leading-relaxed">
                          <li>Open Google Pay, PhonePe, Paytm, or BHIM.</li>
                          <li>Scan the QR code or transfer <strong className="text-[#FFD600]">₹{tournamentInfo?.registrationFee || TOURNAMENT_CONFIG.registrationFee}</strong> to <span className="text-white font-mono font-bold break-all">{activeUpiId || tournamentInfo?.upiId}</span>.</li>
                          <li>Take a clear screenshot showing the <strong>Transaction ID / UTR Number</strong>.</li>
                          <li>Upload the payment screenshot below for admin verification.</li>
                        </ol>
                      </div>
                      <a
                        href={`upi://pay?pa=${activeUpiId || tournamentInfo?.upiId}&pn=${encodeURIComponent(TOURNAMENT_CONFIG.tournamentName)}&am=${tournamentInfo?.registrationFee || TOURNAMENT_CONFIG.registrationFee}&cu=INR&tn=${encodeURIComponent('MINI MAYHEM Registration')}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-[#FFD600] flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Pay Directly via UPI App
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mandatory Upload Box */}
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              
              {/* Field 1: Game Plan Screenshot Upload */}
              <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white">
                      Game Plan Screenshot <span className="text-[#FFD600]">* (Mandatory)</span>
                    </label>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Upload a clear screenshot of your E-Football Game Plan squad. <span className="text-[#FFD600] font-semibold">This screenshot will be visible to other contestants through your public tournament profile.</span> Ensure team strength (≤ 3200) and card ratings are visible.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30 uppercase shrink-0">
                    Public
                  </span>
                </div>

                <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-[#FFD600]/60 transition-colors bg-zinc-900/40 text-center relative group">
                  <input
                    type="file"
                    id="game-plan-screenshot-input"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleGamePlanFileChange}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {gamePlanPreviewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={gamePlanPreviewUrl}
                        alt="Game Plan Screenshot Preview"
                        className="max-h-56 mx-auto rounded-xl border border-zinc-700 shadow-xl object-contain"
                      />
                      <p className="text-xs text-[#FFD600] font-semibold">
                        ✓ Game Plan Selected! Click anywhere to replace image.
                      </p>
                    </div>
                  ) : (
                    <div className="py-3 space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#FFD600] group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          Select or Drop E-Football Game Plan Screenshot
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Supported Formats: JPG, JPEG, PNG, WebP (Max size: 5 MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Field 2: Payment Screenshot Upload */}
              <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white">
                      Payment Screenshot <span className="text-[#FFD600]">* (Mandatory)</span>
                    </label>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Upload proof of ₹{tournamentInfo?.registrationFee || TOURNAMENT_CONFIG.registrationFee} payment showing transaction ID / UTR. <span className="text-zinc-300 font-semibold">Payment screenshots are kept private and verified only by admins.</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase shrink-0">
                    Private
                  </span>
                </div>

                <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-[#FFD600]/60 transition-colors bg-zinc-900/40 text-center relative group">
                  <input
                    type="file"
                    id="payment-screenshot-input"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePaymentFileChange}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {paymentPreviewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={paymentPreviewUrl}
                        alt="Payment Screenshot Preview"
                        className="max-h-56 mx-auto rounded-xl border border-zinc-700 shadow-xl object-contain"
                      />
                      <p className="text-xs text-[#FFD600] font-semibold">
                        ✓ Payment Proof Selected! Click anywhere to replace image.
                      </p>
                    </div>
                  ) : (
                    <div className="py-3 space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#FFD600] group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          Select or Drop Payment Confirmation Screenshot
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Supported Formats: JPG, JPEG, PNG, WebP (Max size: 5 MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !paymentFile || !gamePlanFile}
                  className="flex-1 py-4 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-sm uppercase tracking-wider shadow-yellow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Submitting Registration...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      SUBMIT TOURNAMENT REGISTRATION
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: CONFIRMATION / PENDING VERIFICATION */}
        {step === 4 && existingRegistration && (
          <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider mb-4 inline-block">
              Status: PENDING_VERIFICATION
            </span>

            <h2 className="font-display text-4xl font-extrabold uppercase tracking-wide text-white mb-2">
              REGISTRATION SUBMITTED!
            </h2>

            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Your registration ID is <strong className="text-[#FFD600] font-mono">{existingRegistration.registrationId}</strong>. Our admin team will verify your payment screenshot shortly.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-3.5 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black font-extrabold text-sm uppercase transition-all shadow-yellow-glow"
              >
                GO TO MY DASHBOARD
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TournamentRegistrationFlow;
