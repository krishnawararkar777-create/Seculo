import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const API_BASE_URL = 'https://seculo-2.onrender.com/api';

const countries = [
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === '+91') || countries[0]);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    whatsapp_number: '',
    gemini_api_key: '',
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.includes(countrySearch)
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const phone = formData.whatsapp_number.trim();
    if (!phone || phone.length < 6) {
      setError('Please enter a valid phone number');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.gemini_api_key.startsWith('AIza')) {
      setError('API key must start with "AIza"');
      return false;
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_number: `${selectedCountry.code}${formData.whatsapp_number}`,
          gemini_api_key: formData.gemini_api_key,
          plan: selectedPlan,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to onboard');

      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setCountrySearch('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#155dfd]/5 via-transparent to-transparent" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#155dfd] to-[#6366f1] mb-4 shadow-lg shadow-[#155dfd]/25">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Seculo</h1>
          <p className="text-gray-400 mt-2">Set up your AI assistant in 3 simple steps</p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step === i 
                    ? 'bg-gradient-to-br from-[#155dfd] to-[#6366f1] text-white shadow-lg shadow-[#155dfd]/30 scale-110' 
                    : step > i 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[#1A1A1A] text-gray-500 border border-gray-700'
                }`}>
                  {step > i ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i}
                </div>
                {i < 3 && (
                  <div className={`w-24 h-0.5 mx-2 transition-all duration-300 ${
                    step > i ? 'bg-green-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111111]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl shadow-black/20">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-semibold mb-1">Your WhatsApp Number</h2>
                <p className="text-gray-400 text-sm">We'll use this to identify your account</p>
              </div>

              <div className="flex gap-2">
                <div ref={dropdownRef} className="relative w-36">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full flex items-center gap-2 bg-[#1A1A1A] border border-white/10 rounded-xl px-3 py-3 text-sm hover:border-white/20 transition-all"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                      <div className="p-2 border-b border-white/10">
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#155dfd] outline-none"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.map((country, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectCountry(country)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors ${
                              selectedCountry.code === country.code ? 'bg-[#155dfd]/10 text-[#155dfd]' : ''
                            }`}
                          >
                            <span>{country.flag}</span>
                            <span className="text-sm">{country.name}</span>
                            <span className="text-xs text-gray-500 ml-auto">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#155dfd] outline-none transition-all"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                onClick={nextStep}
                className="w-full py-3.5 bg-gradient-to-r from-[#155dfd] to-[#6366f1] rounded-xl font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-[#155dfd]/20 active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-semibold mb-1">Connect Gemini API</h2>
                <p className="text-gray-400 text-sm">Power your assistant with Google's AI</p>
              </div>

              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#155dfd] hover:underline text-sm"
              >
                Get your free API key at Google AI Studio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <input
                type="text"
                name="gemini_api_key"
                value={formData.gemini_api_key}
                onChange={handleChange}
                placeholder="AIza..."
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-[#155dfd] outline-none transition-all"
              />

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3.5 border border-white/10 rounded-xl font-semibold text-gray-400 hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#155dfd] to-[#6366f1] rounded-xl font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-[#155dfd]/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-semibold mb-1">Choose Your Plan</h2>
                <p className="text-gray-400 text-sm">Select the plan that fits your needs</p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setSelectedPlan('basic')}
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'basic'
                      ? 'border-[#155dfd] bg-[#155dfd]/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {selectedPlan === 'basic' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#155dfd] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === 'basic' ? 'border-[#155dfd]' : 'border-gray-500'
                      }`}>
                        {selectedPlan === 'basic' && <div className="w-2.5 h-2.5 rounded-full bg-[#155dfd]" />}
                      </div>
                      <div>
                        <span className="font-medium">Basic</span>
                        <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Popular</span>
                      </div>
                    </div>
                    <span className="text-xl font-bold">$9<span className="text-sm font-normal text-gray-400">/mo</span></span>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedPlan('pro')}
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'pro'
                      ? 'border-[#6366f1] bg-[#6366f1]/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {selectedPlan === 'pro' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#6366f1] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === 'pro' ? 'border-[#6366f1]' : 'border-gray-500'
                      }`}>
                        {selectedPlan === 'pro' && <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />}
                      </div>
                      <div>
                        <span className="font-medium">Pro</span>
                        <span className="ml-2 text-xs bg-[#155dfd]/20 text-[#155dfd] px-2 py-0.5 rounded-full">Best Value</span>
                      </div>
                    </div>
                    <span className="text-xl font-bold">$19<span className="text-sm font-normal text-gray-400">/mo</span></span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3.5 border border-white/10 rounded-xl font-semibold text-gray-400 hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#155dfd] to-[#6366f1] rounded-xl font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-[#155dfd]/20 disabled:opacity-50"
                >
                  {loading ? 'Deploying...' : 'Deploy Now'}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
              <p className="text-gray-400 mb-8">Your AI assistant is ready to go</p>
              <a
                href="/dashboard"
                className="inline-block w-full py-3.5 bg-gradient-to-r from-[#155dfd] to-[#6366f1] rounded-xl font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-[#155dfd]/20"
              >
                Go to Dashboard
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
