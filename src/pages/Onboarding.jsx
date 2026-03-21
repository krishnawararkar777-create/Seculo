import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const API_BASE_URL = 'https://seculo-2.onrender.com/api';

const countries = [
  { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'US', dial: '+1', name: 'USA', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', name: 'UK', flag: '🇬🇧' },
  { code: 'AE', dial: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', dial: '+1', name: 'Canada', flag: '🇨🇦' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [animatingStep, setAnimatingStep] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

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
    
    setAnimatingStep(step + 1);
    setTimeout(() => {
      setStep(step + 1);
      setAnimatingStep(null);
    }, 600);
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e1e9] font-['Inter'] selection:bg-[#4ff07f]/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        .glass-panel {
          background: rgba(31, 31, 37, 0.4);
          backdrop-filter: blur(20px);
          border: 0.5px solid #2a2a3a;
        }
        .bg-mesh {
          background-image: radial-gradient(circle at 0% 0%, rgba(0, 93, 195, 0.15) 0%, transparent 40%),
                            radial-gradient(circle at 100% 100%, rgba(79, 240, 127, 0.08) 0%, transparent 40%);
        }
        .progress-line {
          height: 2px;
          background: #3c4a3d;
          position: relative;
          overflow: hidden;
        }
        .progress-line-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #25D366;
          transition: width 0.6s ease;
        }
        .step-circle {
          transition: all 0.3s ease;
        }
        .step-circle-active {
          transform: scale(1.1);
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4ff07f] rounded-lg flex items-center justify-center">
            <span className="text-[#003915] font-bold text-sm">⚡</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] font-black text-2xl tracking-tighter text-[#4ff07f]">Seculo</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[#bbcbb9] cursor-pointer hover:text-[#4ff07f] transition-colors text-lg">❓</span>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#3c4a3d]/30 -translate-y-1/2 -z-10"></div>
          
          {/* Line 1-2 Progress */}
          <div className="absolute top-1/2 left-[10%] w-[40%] h-[2px] -translate-y-1/2 -z-10 overflow-hidden">
            <div 
              className="h-full bg-[#25D366] transition-all duration-600 ease-out"
              style={{ 
                width: step > 1 ? '100%' : animatingStep === 2 ? '100%' : '0%',
                transitionDelay: step === 2 || animatingStep === 2 ? '0s' : '0s'
              }}
            ></div>
          </div>
          
          {/* Line 2-3 Progress */}
          <div className="absolute top-1/2 left-[50%] w-[40%] h-[2px] -translate-y-1/2 -z-10 overflow-hidden">
            <div 
              className="h-full bg-[#25D366] transition-all duration-600 ease-out"
              style={{ 
                width: step > 2 ? '100%' : animatingStep === 3 ? '100%' : '0%'
              }}
            ></div>
          </div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-[#0a0a0f] step-circle ${
                step === 1 ? 'bg-[#4ff07f] text-[#003915] step-circle-active' : 
                step > 1 ? 'bg-[#4ff07f] text-[#003915]' : 
                animatingStep === 2 ? 'bg-[#4ff07f]/50 text-[#003915]' : 
                'bg-[#1f1f25] text-[#bbcbb9]'
              }`}
            >
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`font-['Inter'] text-xs uppercase tracking-widest font-bold ${
              step === 1 ? 'text-[#4ff07f]' : 'text-[#bbcbb9]'
            }`}>Identity</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-[#0a0a0f] step-circle ${
                step === 2 ? 'bg-[#4ff07f] text-[#003915] step-circle-active' : 
                step > 2 ? 'bg-[#4ff07f] text-[#003915]' : 
                animatingStep === 2 ? 'bg-[#4ff07f]/50 text-[#003915] step-circle-active' : 
                'bg-[#1f1f25] text-[#bbcbb9]'
              }`}
            >
              {step > 2 ? '✓' : '2'}
            </div>
            <span className={`font-['Inter'] text-xs uppercase tracking-widest font-bold ${
              step === 2 ? 'text-[#4ff07f]' : 'text-[#bbcbb9]'
            }`}>Intelligence</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-[#0a0a0f] step-circle ${
                step === 3 ? 'bg-[#4ff07f] text-[#003915] step-circle-active' : 
                'bg-[#1f1f25] text-[#bbcbb9]'
              }`}
            >
              3
            </div>
            <span className={`font-['Inter'] text-xs uppercase tracking-widest font-bold ${
              step === 3 ? 'text-[#4ff07f]' : 'text-[#bbcbb9]'
            }`}>Selection</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* STEP 1: WhatsApp Identity */}
          <section className={`glass-panel p-8 md:p-12 rounded-2xl ${step !== 1 ? 'hidden' : ''}`}>
            <div className="mb-10">
              <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tighter text-[#e4e1e9] mb-2">Connect WhatsApp</h1>
              <p className="text-[#bbcbb9] text-lg">Enter your primary number to link Seculo AI.</p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block font-['Inter'] text-xs text-[#bbcbb9] mb-2 uppercase tracking-widest font-semibold">Country</label>
                  <div ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full bg-[#1b1b20] h-14 rounded-xl border border-[#3c4a3d]/20 px-4 flex items-center justify-between group focus:border-[#4ff07f] transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-[#e4e1e9]">{selectedCountry.dial}</span>
                      </span>
                      <span className="text-[#bbcbb9] group-hover:text-[#4ff07f] transition-colors">▼</span>
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-[#1b1b20] border border-[#3c4a3d]/20 rounded-xl overflow-hidden shadow-xl z-50">
                        <div className="max-h-48 overflow-y-auto">
                          {countries.map((c, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => selectCountry(c)}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2a292f] transition-colors ${
                                selectedCountry.code === c.code ? 'bg-[#4ff07f]/10 text-[#4ff07f]' : ''
                              }`}
                            >
                              <span className="text-lg">{c.flag}</span>
                              <span className="text-[#bbcbb9] font-mono text-sm w-12">{c.dial}</span>
                              <span className="text-[#e4e1e9] text-sm flex-1 text-left">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="block font-['Inter'] text-xs text-[#bbcbb9] mb-2 uppercase tracking-widest font-semibold">Phone Number</label>
                  <div className="relative">
                    <input
                      name="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={handleChange}
                      className="w-full bg-[#1b1b20] h-14 rounded-xl border border-[#3c4a3d]/20 px-4 pr-12 text-[#e4e1e9] placeholder:text-[#bbcbb9]/40 focus:border-[#4ff07f] transition-all outline-none"
                      placeholder="9876543210"
                      type="tel"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bbcbb9]/40 text-lg">📱</span>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                onClick={nextStep}
                className="w-full h-16 bg-[#4ff07f] hover:bg-[#25d366] text-[#003915] font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] rounded-xl transition-all active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          </section>

          {/* STEP 2: Gemini Intelligence */}
          <section className={`glass-panel p-8 md:p-12 rounded-2xl ${step !== 2 ? 'hidden' : ''}`}>
            <div className="mb-10">
              <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tighter text-[#e4e1e9] mb-2">Gemini API Key</h1>
              <p className="text-[#bbcbb9] text-lg">Power your workflows with Google's advanced intelligence.</p>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-['Inter'] text-xs text-[#bbcbb9] uppercase tracking-widest font-semibold">API Key</label>
                  <a className="text-xs text-[#4ff07f] font-bold hover:underline flex items-center gap-1" href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer">
                    Get free key from aistudio.google.com ↗
                  </a>
                </div>
                <div className="relative">
                  <input
                    name="gemini_api_key"
                    value={formData.gemini_api_key}
                    onChange={handleChange}
                    className="w-full bg-[#1b1b20] h-14 rounded-xl border border-[#3c4a3d]/20 px-4 pr-12 text-[#e4e1e9] placeholder:text-[#bbcbb9]/40 focus:border-[#4ff07f] transition-all outline-none"
                    placeholder="AIzaSy..."
                    type="password"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bbcbb9]/40 cursor-pointer text-lg">👁</span>
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 h-16 bg-[#1f1f25] hover:bg-[#2a292f] text-[#e4e1e9] font-['Plus_Jakarta_Sans'] font-bold rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 h-16 bg-[#4ff07f] hover:bg-[#25d366] text-[#003915] font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] rounded-xl transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          </section>

          {/* STEP 3: Plan Selection */}
          <section className={`glass-panel p-8 md:p-12 rounded-2xl ${step !== 3 ? 'hidden' : ''}`}>
            <div className="mb-10 text-center">
              <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tighter text-[#e4e1e9] mb-2">Choose Plan</h1>
              <p className="text-[#bbcbb9] text-lg">Select the scale of your intelligence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Basic Plan */}
              <div
                onClick={() => setSelectedPlan('basic')}
                className={`bg-[#1b1b20] p-8 rounded-2xl border transition-all cursor-pointer group ${
                  selectedPlan === 'basic' ? 'border-[#4ff07f]/50' : 'border-[#3c4a3d]/20 hover:border-[#4ff07f]/50'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#e4e1e9]">Basic</h3>
                    <p className="text-[#bbcbb9] text-sm mt-1">For personal optimization</p>
                  </div>
                  <span className="text-[#4ff07f] text-xl">{selectedPlan === 'basic' ? '✅' : '⚪'}</span>
                </div>
                <div className="mb-6">
                  <span className="font-['Plus_Jakarta_Sans'] text-4xl font-black text-[#e4e1e9]">$9</span>
                  <span className="text-[#bbcbb9]">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-[#bbcbb9] text-sm">
                    <span className="text-[#4ff07f]">✓</span>
                    1,000 Messages / month
                  </li>
                  <li className="flex items-center gap-2 text-[#bbcbb9] text-sm">
                    <span className="text-[#4ff07f]">✓</span>
                    Standard Support
                  </li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div
                onClick={() => setSelectedPlan('pro')}
                className={`bg-[#1f1f25] border-2 p-8 rounded-2xl relative overflow-hidden transition-all cursor-pointer ${
                  selectedPlan === 'pro' ? 'border-[#4ff07f]/40' : 'border-[#3c4a3d]/20 hover:border-[#4ff07f]/40'
                }`}
              >
                <div className="absolute top-0 right-0 bg-[#4ff07f] px-3 py-1 rounded-bl-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#003915]">Most Popular</span>
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#e4e1e9]">Pro</h3>
                    <p className="text-[#bbcbb9] text-sm mt-1">For power users & teams</p>
                  </div>
                  <span className="text-[#4ff07f] text-xl">{selectedPlan === 'pro' ? '✅' : '⚪'}</span>
                </div>
                <div className="mb-6">
                  <span className="font-['Plus_Jakarta_Sans'] text-4xl font-black text-[#e4e1e9]">$19</span>
                  <span className="text-[#bbcbb9]">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-[#bbcbb9] text-sm">
                    <span className="text-[#4ff07f]">✓</span>
                    Unlimited Messages
                  </li>
                  <li className="flex items-center gap-2 text-[#bbcbb9] text-sm">
                    <span className="text-[#4ff07f]">✓</span>
                    Priority 24/7 Support
                  </li>
                  <li className="flex items-center gap-2 text-[#bbcbb9] text-sm">
                    <span className="text-[#4ff07f]">✓</span>
                    Advanced Analytics
                  </li>
                </ul>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="flex-1 h-16 bg-[#1f1f25] hover:bg-[#2a292f] text-[#e4e1e9] font-['Plus_Jakarta_Sans'] font-bold rounded-xl transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-16 bg-[#4ff07f] hover:bg-[#25d366] text-[#003915] font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Deploying...' : 'Deploy Now'}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Branding Element Background */}
      <div className="fixed bottom-0 left-0 w-full h-96 -z-20 opacity-20 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-gradient-to-t from-[#4ff07f]/10 to-transparent blur-[120px]"></div>
      </div>
    </div>
  );
}
