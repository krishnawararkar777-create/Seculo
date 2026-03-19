import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { API_BASE_URL } from '../api';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    whatsapp_number: '',
    gemini_api_key: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const whatsapp = formData.whatsapp_number.trim();
    const isValid = /^\+?\d{1,4}?\d{6,12}$/.test(whatsapp.replace(/[\s\-()]/g, ''));
    if (!isValid || !whatsapp.startsWith('+')) {
      setError('Please enter a valid WhatsApp number with country code (e.g., +1)');
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

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_number: formData.whatsapp_number,
          gemini_api_key: formData.gemini_api_key,
          plan: selectedPlan,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to onboard');
      }

      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <span className="text-3xl font-bold font-serif text-white tracking-tight">Seculo</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Setup Your Assistant
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Complete 3 steps to deploy your AI bot
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111111] py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-white/10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${step === 1 ? 'bg-[#155dfd] scale-125' : step > 1 ? 'bg-green-500' : 'bg-gray-700'}`} />
              <span className="text-xs text-gray-400">WhatsApp</span>
            </div>
            <div className="w-8 h-px bg-gray-700" />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${step === 2 ? 'bg-[#155dfd] scale-125' : step > 2 ? 'bg-green-500' : 'bg-gray-700'}`} />
              <span className="text-xs text-gray-400">API Key</span>
            </div>
            <div className="w-8 h-px bg-gray-700" />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${step === 3 ? 'bg-[#155dfd] scale-125' : step > 3 ? 'bg-green-500' : 'bg-gray-700'}`} />
              <span className="text-xs text-gray-400">Plan</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-300">
                  WhatsApp Number
                </label>
                <p className="text-xs text-gray-500 mb-2">Include country code (e.g., +1, +91)</p>
                <input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  type="tel"
                  required
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="mt-1 block w-full appearance-none rounded-md border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white placeholder-gray-500 transition-all focus:border-[#155dfd] focus:outline-none focus:ring-1 focus:ring-[#155dfd] sm:text-sm"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
              <button
                type="button"
                onClick={nextStep}
                className="flex w-full justify-center rounded-md border border-transparent bg-[#155dfd] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#104bc2] transition-all focus:outline-none focus:ring-2 focus:ring-[#155dfd] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="gemini_api_key" className="block text-sm font-medium text-gray-300">
                  Gemini API Key
                </label>
                <p className="text-xs text-gray-500 mb-2">Get your free key from Google AI Studio</p>
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#155dfd] hover:underline mb-3 text-xs"
                >
                  Get API key at aistudio.google.com
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <input
                  id="gemini_api_key"
                  name="gemini_api_key"
                  type="text"
                  required
                  value={formData.gemini_api_key}
                  onChange={handleChange}
                  placeholder="AIza..."
                  className="mt-1 block w-full appearance-none rounded-md border border-white/10 bg-[#1A1A1A] px-3 py-2 text-white placeholder-gray-500 font-mono transition-all focus:border-[#155dfd] focus:outline-none focus:ring-1 focus:ring-[#155dfd] sm:text-sm"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex w-1/3 justify-center rounded-md border border-white/10 py-2 px-4 text-sm font-medium text-gray-400 hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex w-2/3 justify-center rounded-md border border-transparent bg-[#155dfd] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#104bc2] transition-all focus:outline-none focus:ring-2 focus:ring-[#155dfd] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Choose Your Plan
                </label>
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedPlan('basic')}
                    className={`bg-[#1A1A1A] border rounded-xl p-4 cursor-pointer transition-all ${selectedPlan === 'basic' ? 'border-[#155dfd] bg-[rgba(21,93,253,0.1)]' : 'border-white/10 hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'basic' ? 'border-[#155dfd]' : 'border-gray-600'}`}>
                          {selectedPlan === 'basic' && <div className="w-2 h-2 rounded-full bg-[#155dfd]" />}
                        </div>
                        <span className="text-sm font-medium text-white">Basic</span>
                      </div>
                      <span className="text-lg font-bold text-white">$9<span className="text-sm font-normal text-gray-400">/mo</span></span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 ml-7">1 WhatsApp Bot, Gemini API, Basic Support</p>
                  </div>

                  <div
                    onClick={() => setSelectedPlan('pro')}
                    className={`bg-[#1A1A1A] border rounded-xl p-4 cursor-pointer transition-all ${selectedPlan === 'pro' ? 'border-[#155dfd] bg-[rgba(21,93,253,0.1)]' : 'border-white/10 hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'pro' ? 'border-[#155dfd]' : 'border-gray-600'}`}>
                          {selectedPlan === 'pro' && <div className="w-2 h-2 rounded-full bg-[#155dfd]" />}
                        </div>
                        <span className="text-sm font-medium text-white">Pro</span>
                        <span className="px-2 py-0.5 bg-[#155dfd]/20 text-[#155dfd] text-xs font-medium rounded-full">Best Value</span>
                      </div>
                      <span className="text-lg font-bold text-white">$19<span className="text-sm font-normal text-gray-400">/mo</span></span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 ml-7">Unlimited Bots, Priority Support, Advanced Features</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex w-1/3 justify-center rounded-md border border-white/10 py-2 px-4 text-sm font-medium text-gray-400 hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-2/3 justify-center rounded-md border border-transparent bg-[#155dfd] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#104bc2] transition-all focus:outline-none focus:ring-2 focus:ring-[#155dfd] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50"
                >
                  {loading ? 'Deploying...' : 'Confirm & Deploy'}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">You are all set!</h3>
              <p className="text-sm text-gray-400 mb-6">Your AI assistant is ready. Let's get started!</p>
              <Link
                to="/dashboard"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#155dfd] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#104bc2] transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
