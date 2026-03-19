import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const API_BASE_URL = 'https://seculo-2.onrender.com/api';

const countries = [
  { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'US', dial: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', dial: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', dial: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'JP', dial: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', dial: '+86', name: 'China', flag: '🇨🇳' },
  { code: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', dial: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'PK', dial: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', dial: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'ID', dial: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'MY', dial: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'BR', dial: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', dial: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IT', dial: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', dial: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', dial: '+31', name: 'Netherlands', flag: '🇳🇱' },
];

const chatMessages = [
  { type: 'user', text: 'What is the weather today?' },
  { type: 'bot', text: 'Mumbai: 32°C ☀️ Sunny. Perfect day to go out!' },
  { type: 'user', text: 'Remind me to call mom at 5pm' },
  { type: 'bot', text: 'Done! ✅ Reminder set for 5:00 PM' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [chatStep, setChatStep] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const [formData, setFormData] = useState({
    whatsapp_number: '',
    gemini_api_key: '',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showTyping) {
        setChatStep(prev => {
          if (prev >= chatMessages.length - 1) {
            setTimeout(() => setChatStep(0), 2000);
            return -1;
          }
          return prev + 1;
        });
        if (chatStep >= 0 && chatStep < chatMessages.length - 1) {
          setShowTyping(true);
          setTimeout(() => setShowTyping(false), 1500);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [chatStep, showTyping]);

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
    c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.dial.includes(countrySearch)
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
          whatsapp_number: `${selectedCountry.dial}${formData.whatsapp_number}`,
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
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-[45%] p-6 lg:p-12 flex flex-col relative">
        {/* Vertical divider */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#2a2d3a] to-transparent" />
        
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-[#4f8ef7] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold">Seculo</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Setup Your Assistant</h1>
        <p className="text-gray-400 mb-10">Complete 3 steps to deploy your AI bot</p>

        {/* Step Indicators */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step === i 
                  ? 'bg-[#4f8ef7] text-white shadow-lg shadow-[#4f8ef7]/30' 
                  : step > i 
                    ? 'bg-green-500 text-white' 
                    : 'border-2 border-gray-600 text-gray-500'
              }`}>
                {step > i ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i}
              </div>
              {i < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${step > i ? 'bg-green-500' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-sm text-gray-400 mb-2">WhatsApp Number</label>
                <div className="flex gap-2">
                  <div ref={dropdownRef} className="relative w-[120px] flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full flex items-center gap-1.5 bg-[#1a1a2e] border border-[#2a2d3a] rounded-xl px-3 py-3 hover:border-[#4f8ef7]/50 transition-all"
                    >
                      <span className="text-sm">{selectedCountry.flag}</span>
                      <span className="text-[#4f8ef7] font-mono text-sm font-medium">{selectedCountry.dial}</span>
                      <svg className="w-4 h-4 ml-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 w-[280px] mt-2 bg-[#1a1a2e] border border-[#2a2d3a] rounded-xl overflow-hidden shadow-xl z-50">
                        <div className="p-2 border-b border-[#2a2d3a]">
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full bg-[#0f1117] text-white text-sm rounded-lg px-3 py-2.5 placeholder-gray-500 focus:border-[#4f8ef7] outline-none border border-[#2a2d3a]"
                          />
                        </div>
                        <div className="max-h-52 overflow-y-auto scrollbar-thin">
                          {filteredCountries.map((c, idx) => (
                            <button
                              key={idx}
                              onClick={() => selectCountry(c)}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-[#2a2d3a] transition-colors ${
                                selectedCountry.code === c.code ? 'bg-[#4f8ef7]/20 text-[#4f8ef7]' : ''
                              }`}
                            >
                              <span className="text-base">{c.flag}</span>
                              <span className="text-xs text-gray-500 font-mono bg-[#2a2d3a] px-1.5 py-0.5 rounded">{c.code}</span>
                              <span className="text-[#4f8ef7] font-mono text-sm">{c.dial}</span>
                              <span className="text-white text-sm flex-1 text-left">{c.name}</span>
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
                    className="flex-1 bg-[#1a1a2e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-sm focus:border-[#4f8ef7] outline-none transition-all"
                  />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={nextStep}
                className="w-full py-3.5 bg-[#4f8ef7] rounded-xl font-medium text-white hover:bg-[#3d7de0] transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Gemini API Key</label>
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#4f8ef7] hover:underline text-sm mb-3"
                >
                  Get free API key at Google AI Studio
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <input
                  type="text"
                  name="gemini_api_key"
                  value={formData.gemini_api_key}
                  onChange={handleChange}
                  placeholder="AIza..."
                  className="w-full bg-[#1a1a2e] border border-[#2a2d3a] rounded-xl px-4 py-3 text-sm font-mono focus:border-[#4f8ef7] outline-none transition-all"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3.5 border border-[#2a2d3a] rounded-xl font-medium text-gray-400 hover:bg-[#1a1a2e] transition-all">
                  Back
                </button>
                <button onClick={nextStep} className="flex-1 py-3.5 bg-[#4f8ef7] rounded-xl font-medium text-white hover:bg-[#3d7de0] transition-all">
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-sm text-gray-400 mb-3">Choose Your Plan</label>
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedPlan('basic')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlan === 'basic' ? 'border-[#4f8ef7] bg-[#4f8ef7]/5' : 'border-[#2a2d3a] hover:border-[#4f8ef7]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'basic' ? 'border-[#4f8ef7]' : 'border-gray-500'}`}>
                          {selectedPlan === 'basic' && <div className="w-2.5 h-2.5 rounded-full bg-[#4f8ef7]" />}
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
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlan === 'pro' ? 'border-[#4f8ef7] bg-[#4f8ef7]/5' : 'border-[#2a2d3a] hover:border-[#4f8ef7]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'pro' ? 'border-[#4f8ef7]' : 'border-gray-500'}`}>
                          {selectedPlan === 'pro' && <div className="w-2.5 h-2.5 rounded-full bg-[#4f8ef7]" />}
                        </div>
                        <div>
                          <span className="font-medium">Pro</span>
                          <span className="ml-2 text-xs bg-[#4f8ef7]/20 text-[#4f8ef7] px-2 py-0.5 rounded-full">Best Value</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold">$19<span className="text-sm font-normal text-gray-400">/mo</span></span>
                    </div>
                  </div>
                </div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">{error}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={prevStep} className="flex-1 py-3.5 border border-[#2a2d3a] rounded-xl font-medium text-gray-400 hover:bg-[#1a1a2e] transition-all">
                  Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-[#4f8ef7] rounded-xl font-medium text-white hover:bg-[#3d7de0] transition-all disabled:opacity-50">
                  {loading ? 'Deploying...' : 'Deploy Now'}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
              <p className="text-gray-400 mb-6">Your AI assistant is ready to go</p>
              <a href="/dashboard" className="inline-block w-full py-3.5 bg-[#4f8ef7] rounded-xl font-medium text-white hover:bg-[#3d7de0] transition-all">
                Go to Dashboard
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - WhatsApp Mockup */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0a0a0f] items-center justify-center p-12">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/5 blur-3xl rounded-full" />
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-72 bg-[#1a1a2e] rounded-[2.5rem] p-3 shadow-2xl">
              <div className="bg-[#111b21] rounded-[2rem] overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-[#202b33] px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">Seculo AI</p>
                    <p className="text-green-400 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>
                {/* Chat Area */}
                <div className="h-96 p-4 space-y-3 bg-[#111b21]">
                  {chatMessages.slice(0, Math.max(0, chatStep)).map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm animate-fadeIn ${
                        msg.type === 'user' 
                          ? 'bg-[#005c4b] text-white rounded-br-md' 
                          : 'bg-[#202b33] text-white rounded-bl-md'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {showTyping && chatStep >= 0 && chatStep < chatMessages.length && (
                    <div className="flex justify-start">
                      <div className="bg-[#202b33] px-4 py-3 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <p className="text-center mt-6 text-gray-400 text-sm">Your AI assistant replies in seconds</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #1a1a2e; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #3a3d4a; }
      `}</style>
    </div>
  );
}
