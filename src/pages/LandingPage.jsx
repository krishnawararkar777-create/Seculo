import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 blueprint-bg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
        }
        .blueprint-bg {
          background-image: 
            linear-gradient(rgba(42, 42, 58, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(42, 42, 58, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .obsidian-card {
          background: linear-gradient(145deg, #0d0d12 0%, #050505 100%);
          border: 0.5px solid #2a2a3a;
        }
        .laser-glow {
          box-shadow: 0 0 20px -5px rgba(37, 211, 102, 0.3);
        }
        .text-small-cap {
          font-variant: small-caps;
          letter-spacing: 0.15em;
        }
        .glass-overlay {
          backdrop-filter: blur(12px);
          background: rgba(10, 10, 10, 0.6);
          border: 0.5px solid rgba(42, 42, 58, 0.4);
        }
        .neural-node {
          position: relative;
        }
        .neural-node::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: conic-gradient(from 0deg, transparent 0%, #25D366 20%, transparent 40%);
          border-radius: inherit;
          animation: rotate 4s linear infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 1px;
        }
        @keyframes rotate {
          to { transform: rotate(360deg); }
        }
        details summary::-webkit-details-marker {
          display: none;
        }
        [data-mode="connect"] {
          --tw-border-opacity: 1;
          --tw-bg-opacity: 1;
          --tw-text-opacity: 1;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border-obsidian/30 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-5 max-w-[1400px] mx-auto">
          <div className="text-xl font-bold tracking-tightest flex items-center gap-3">
            <div className="w-6 h-6 border-[1.5px] border-primary flex items-center justify-center rotate-45">
              <div className="w-2 h-2 bg-primary -rotate-45"></div>
            </div>
            SECULO <span className="text-[10px] text-primary font-mono tracking-widest mt-1">V.4.0</span>
          </div>
          <div className="hidden md:flex items-center space-x-12">
            <button onClick={() => scrollToSection('features')} className="text-small-cap text-xs font-semibold text-on-surface-variant hover:text-white transition-all cursor-pointer bg-transparent border-none">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-small-cap text-xs font-semibold text-on-surface-variant hover:text-white transition-all cursor-pointer bg-transparent border-none">How It Works</button>
            <button onClick={() => scrollToSection('pricing')} className="text-small-cap text-xs font-semibold text-on-surface-variant hover:text-white transition-all cursor-pointer bg-transparent border-none">Pricing</button>
            <button onClick={() => scrollToSection('faq')} className="text-small-cap text-xs font-semibold text-on-surface-variant hover:text-white transition-all cursor-pointer bg-transparent border-none">FAQ</button>
          </div>
          <button onClick={() => navigate('/login')} className="bg-white text-black text-small-cap text-[10px] font-black px-6 py-2 tracking-widest hover:bg-primary hover:text-black transition-colors cursor-pointer">
            Initialize Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-40 overflow-hidden">
        {/* Light Leak */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="max-w-[1400px] mx-auto px-8 text-center relative z-10">
          <div className="inline-block border-[0.5px] border-primary/30 bg-primary/5 px-4 py-1 mb-12 rounded-full">
            <span className="text-small-cap text-[10px] font-bold tracking-[0.3em] text-primary">🟢 Now Live — Join 1,000+ users</span>
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black font-headline tracking-tightest leading-[0.85] uppercase mb-12">
            your&nbsp; PERSONAL&nbsp; AI<br />
            <span className="text-primary italic">on WHATSAPP</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            No coding. No setup. Just scan a QR code and your AI assistant is live in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
            <button onClick={() => navigate('/login')} className="px-12 py-5 bg-primary text-black font-black text-small-cap text-sm tracking-widest hover:scale-[1.02] transition-transform cursor-pointer">
              Get Started Free
            </button>
            <button className="px-12 py-5 border-[0.5px] border-border-obsidian text-white font-black text-small-cap text-sm tracking-widest hover:bg-white/5 transition-colors cursor-pointer">
              Watch Demo
            </button>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-background bg-green-500"></div>
              <div className="w-10 h-10 rounded-full border-2 border-background bg-purple-500"></div>
              <div className="w-10 h-10 rounded-full border-2 border-background bg-emerald-500"></div>
              <div className="w-10 h-10 rounded-full border-2 border-background bg-orange-500"></div>
              <div className="w-10 h-10 rounded-full border-2 border-background bg-red-500"></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Joined by 1,200+ users this month</span>
              <span className="text-xs mt-1">⭐⭐⭐⭐⭐ 4.9/5</span>
            </div>
          </div>
        </div>

        {/* Cinematic Mockup */}
        <div className="mt-32 relative w-full max-w-5xl mx-auto px-8 group">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="obsidian-card rounded-t-3xl p-4 md:p-8 pb-0 border-b-0 shadow-[0_-20px_50px_-20px_rgba(37,211,102,0.1)]">
            <div className="bg-background rounded-t-2xl border-t border-x border-border-obsidian overflow-hidden aspect-[21/9] flex">
              <div className="flex-1 flex flex-col border-r border-border-obsidian/30">
                <div className="h-14 border-b border-border-obsidian/30 flex items-center px-6 gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                  <span className="ml-4 text-[10px] text-small-cap font-bold text-on-surface-variant">WhatsApp Interface: Active</span>
                </div>
                <div className="flex-1 p-8 font-mono text-xs space-y-6">
                  <div className="text-on-surface-variant flex gap-4">
                    <span className="text-primary shrink-0">&gt;</span>
                    <span>Connected to WhatsApp [SECURE]</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-primary shrink-0">User:</span>
                    <span className="text-white">What is the weather today?</span>
                  </div>
                  <div className="text-primary/80 flex gap-4 leading-relaxed bg-primary/5 p-4 border-l-2 border-primary">
                    <span>Seculo AI: Mumbai: 32°C ☀️ Sunny!</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex w-80 flex-col border-border-obsidian/30 bg-obsidian/50 p-8 space-y-12">
                <div>
                  <div className="text-small-cap text-[9px] font-bold text-on-surface-variant mb-4 tracking-[0.2em]">Response Time</div>
                  <div className="text-4xl font-black text-primary">0.08<span className="text-xs ml-1">MS</span></div>
                  <div className="w-full h-[1px] bg-border-obsidian mt-4">
                    <div className="w-[98%] h-full bg-primary shadow-[0_0_10px_#25D366]"></div>
                  </div>
                </div>
                <div>
                  <div className="text-small-cap text-[9px] font-bold text-on-surface-variant mb-4 tracking-[0.2em]">Active Sessions</div>
                  <div className="text-4xl font-black text-white italic tracking-tighter">1,200+</div>
                  <div className="text-[10px] text-on-surface-variant mt-2 font-mono">GLOBAL USERS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="py-60 relative" id="how-it-works">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Left Info */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="text-primary text-small-cap text-xs font-black tracking-[0.4em] mb-6 uppercase">How It Works</div>
              <h2 className="text-5xl md:text-7xl font-black font-headline tracking-tightest leading-none uppercase mb-12">
                Up and running in <span className="text-primary">3 steps</span>
              </h2>
              <div className="space-y-12">
                <div className="group cursor-default border-l-[0.5px] border-border-obsidian pl-8 hover:border-primary transition-colors">
                  <div className="text-primary/20 text-4xl font-black font-headline mb-2">01</div>
                  <h4 className="text-xl font-bold mb-4">Create Account</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">Sign up with Google in one click. No password needed.</p>
                </div>
                <div className="group cursor-default border-l-[0.5px] border-border-obsidian pl-8 hover:border-primary transition-colors">
                  <div className="text-primary/20 text-4xl font-black font-headline mb-2">02</div>
                  <h4 className="text-xl font-bold mb-4">Add Your API Key</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">Get a free Gemini API key from Google and paste it in. Takes 2 minutes.</p>
                </div>
                <div className="group cursor-default border-l-[0.5px] border-border-obsidian pl-8 hover:border-primary transition-colors">
                  <div className="text-primary/20 text-4xl font-black font-headline mb-2">03</div>
                  <h4 className="text-xl font-bold mb-4">Scan &amp; Go Live</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">Scan the QR code from your dashboard. Your AI is live instantly.</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-2xl bg-obsidian rounded-full border border-border-obsidian/30 flex items-center justify-center p-12">
                <div className="absolute inset-4 rounded-full border-[0.5px] border-dashed border-border-obsidian animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-12 rounded-full border-[0.5px] border-border-obsidian animate-[spin_30s_linear_infinite_reverse]"></div>
                <div className="absolute inset-24 rounded-full border-[0.5px] border-primary/20"></div>
                <div className="relative w-full h-full neural-node rounded-full flex items-center justify-center obsidian-card">
                  <div className="text-center">
                    <div className="text-primary font-black text-8xl mb-2 tracking-tightest">60<span className="text-2xl">SEC</span></div>
                    <div className="text-small-cap text-xs font-bold text-on-surface-variant tracking-[0.3em]">Total Setup Time</div>
                  </div>
                  <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 bg-primary rounded-full laser-glow animate-pulse"></div>
                  <div className="absolute bottom-[15%] right-[25%] w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
                  <div className="absolute top-[40%] right-[10%] w-1.5 h-1.5 bg-primary rounded-full laser-glow animate-pulse delay-300"></div>
                  <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-primary/20 to-transparent rotate-45"></div>
                  <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features: Pro-Grade Intelligence */}
      <section className="py-60 bg-obsidian border-y border-border-obsidian" id="features">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-12">
            <div className="max-w-2xl">
              <div className="text-primary text-small-cap text-xs font-black tracking-[0.4em] mb-6">Capabilities</div>
              <h2 className="text-6xl md:text-8xl font-black font-headline tracking-tightest leading-none uppercase">
                EVERYTHING<br />YOU NEED
              </h2>
            </div>
            <p className="text-on-surface-variant font-medium text-lg max-w-sm mb-4">
              The most powerful AI features, delivered directly to your favorite messaging app.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border-obsidian">
            {/* Feature Card 1 */}
            <div className="bg-background p-12 group hover:bg-obsidian transition-colors relative overflow-hidden cursor-default">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="material-symbols-outlined text-primary mb-12 block text-3xl">bolt</span>
              <h4 className="text-small-cap text-lg font-bold text-white mb-4 tracking-widest">Instant Setup</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Live in 60 seconds. Just scan QR code.</p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-background p-12 group hover:bg-obsidian transition-colors relative overflow-hidden cursor-default">
              <span className="material-symbols-outlined text-primary mb-12 block text-3xl">public</span>
              <h4 className="text-small-cap text-lg font-bold text-white mb-4 tracking-widest">Web Search</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Ask anything. Bot searches internet in real time.</p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-background p-12 group hover:bg-obsidian transition-colors relative overflow-hidden cursor-default">
              <span className="material-symbols-outlined text-primary mb-12 block text-3xl">description</span>
              <h4 className="text-small-cap text-lg font-bold text-white mb-4 tracking-widest">Document Reading</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Send any PDF. Bot reads and answers questions.</p>
            </div>
            {/* Feature Card 4 */}
            <div className="bg-background p-12 group hover:bg-obsidian transition-colors relative overflow-hidden cursor-default">
              <span className="material-symbols-outlined text-primary mb-12 block text-3xl">notifications_active</span>
              <h4 className="text-small-cap text-lg font-bold text-white mb-4 tracking-widest">Smart Reminders</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Set reminders naturally. Just say it in plain language.</p>
            </div>
            {/* Feature Card 5 */}
            <div className="bg-background p-12 group hover:bg-obsidian transition-colors relative overflow-hidden cursor-default">
              <span className="material-symbols-outlined text-primary mb-12 block text-3xl">psychology</span>
              <h4 className="text-small-cap text-lg font-bold text-white mb-4 tracking-widest">Memory</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Bot remembers your preferences and past conversations.</p>
            </div>
            {/* Feature Card 6 */}
            <div className="bg-background p-12 group hover:bg-obsidian transition-colors relative overflow-hidden cursor-default">
              <span className="material-symbols-outlined text-primary mb-12 block text-3xl">encrypted</span>
              <h4 className="text-small-cap text-lg font-bold text-white mb-4 tracking-widest">Private &amp; Secure</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Your data never leaves your own API key.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-60" id="pricing">
        <div className="max-w-[1400px] mx-auto px-8 text-center mb-32">
          <div className="text-primary text-small-cap text-xs font-black tracking-[0.4em] mb-6">Pricing</div>
          <h2 className="text-6xl md:text-8xl font-black font-headline tracking-tightest leading-none uppercase">Tiered Access</h2>
          <p className="text-on-surface-variant mt-8 text-lg font-medium">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-border-obsidian">
          {/* Basic Plan */}
          <div className="bg-background p-16 text-left group cursor-default">
            <div className="text-small-cap text-[10px] font-bold text-on-surface-variant mb-8">Basic</div>
            <div className="flex items-baseline gap-2 mb-12">
              <span className="text-6xl font-black text-white">$9</span>
              <span className="text-small-cap text-xs text-on-surface-variant font-bold">/ Month</span>
            </div>
            <ul className="space-y-6 mb-16">
              <li className="flex items-center gap-4 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> 1 WhatsApp number
              </li>
              <li className="flex items-center gap-4 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Unlimited messages
              </li>
              <li className="flex items-center gap-4 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Gemini AI powered
              </li>
              <li className="flex items-center gap-4 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Web search
              </li>
              <li className="flex items-center gap-4 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Document reading
              </li>
              <li className="flex items-center gap-4 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Email support
              </li>
            </ul>
            <button onClick={() => navigate('/login')} className="w-full py-5 border border-border-obsidian text-small-cap text-xs font-black hover:bg-white hover:text-black transition-all cursor-pointer">Get Started</button>
          </div>

          {/* Pro Plan */}
          <div className="bg-obsidian p-16 text-left relative overflow-hidden group cursor-default">
            <div className="absolute top-0 right-0 w-full h-[2px] bg-primary"></div>
            <div className="text-small-cap text-[10px] font-bold text-primary mb-8 tracking-widest uppercase">Pro • Most Popular</div>
            <div className="flex items-baseline gap-2 mb-12">
              <span className="text-6xl font-black text-white">$19</span>
              <span className="text-small-cap text-xs text-on-surface-variant font-bold">/ Month</span>
            </div>
            <ul className="space-y-6 mb-16">
              <li className="flex items-center gap-4 text-sm font-bold text-white">
                <div className="w-2 h-2 bg-primary laser-glow rounded-full"></div> 3 WhatsApp numbers
              </li>
              <li className="flex items-center gap-4 text-sm font-bold text-white">
                <div className="w-2 h-2 bg-primary laser-glow rounded-full"></div> Everything in Basic
              </li>
              <li className="flex items-center gap-4 text-sm font-bold text-white">
                <div className="w-2 h-2 bg-primary laser-glow rounded-full"></div> Priority support
              </li>
              <li className="flex items-center gap-4 text-sm font-bold text-white">
                <div className="w-2 h-2 bg-primary laser-glow rounded-full"></div> Custom bot personality
              </li>
              <li className="flex items-center gap-4 text-sm font-bold text-white">
                <div className="w-2 h-2 bg-primary laser-glow rounded-full"></div> Message scheduling
              </li>
              <li className="flex items-center gap-4 text-sm font-bold text-white">
                <div className="w-2 h-2 bg-primary laser-glow rounded-full"></div> Advanced memory
              </li>
            </ul>
            <button onClick={() => navigate('/login')} className="w-full py-5 bg-primary text-black text-small-cap text-xs font-black hover:scale-[1.02] transition-transform cursor-pointer">Get Started</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-60 border-t border-border-obsidian" id="faq">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-24">
            <div className="text-primary text-small-cap text-xs font-black tracking-[0.4em] mb-6">Help</div>
            <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tightest leading-none uppercase">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <details className="group bg-obsidian border border-border-obsidian/30 p-6 rounded-2xl cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-white list-none">
                Do I need any technical knowledge?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant leading-relaxed text-sm">
                Zero technical knowledge needed. If you can scan a QR code you can use Seculo.
              </div>
            </details>
            <details className="group bg-obsidian border border-border-obsidian/30 p-6 rounded-2xl cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-white list-none">
                What is a Gemini API key?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant leading-relaxed text-sm">
                It is a free key from Google that powers your AI. We guide you to get it in 2 minutes.
              </div>
            </details>
            <details className="group bg-obsidian border border-border-obsidian/30 p-6 rounded-2xl cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-white list-none">
                Will my WhatsApp number still work normally?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant leading-relaxed text-sm">
                Yes! You can still use WhatsApp normally. The AI only replies when you are not available.
              </div>
            </details>
            <details className="group bg-obsidian border border-border-obsidian/30 p-6 rounded-2xl cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-white list-none">
                Can I cancel anytime?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant leading-relaxed text-sm">
                Yes. Cancel anytime with one click. No questions asked.
              </div>
            </details>
            <details className="group bg-obsidian border border-border-obsidian/30 p-6 rounded-2xl cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-lg text-white list-none">
                Is my data safe?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant leading-relaxed text-sm">
                Your conversations are processed by your own Gemini API key. We never store your messages.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-60 max-w-[1400px] mx-auto px-8">
        <div className="obsidian-card p-24 md:p-40 text-center relative overflow-hidden group rounded-[24px]">
          {/* Light Leak */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -mr-40 -mt-40"></div>
          <div className="relative z-10">
            <h2 className="text-6xl md:text-9xl font-black font-headline tracking-tightest leading-[0.85] uppercase mb-16">
              START<br />CHATTING<br /><span className="text-primary italic">TODAY</span>
            </h2>
            <p className="text-xl text-on-surface-variant max-w-xl mx-auto mb-16 font-medium">
              Join 1,200+ users who already have their personal AI assistant on WhatsApp.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button onClick={() => navigate('/login')} className="px-16 py-6 bg-primary text-black font-black text-small-cap text-sm tracking-widest hover:bg-white transition-colors cursor-pointer">
                Get Started Free →
              </button>
              <span className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-24 px-8 border-t border-border-obsidian">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="text-xl font-bold tracking-tightest mb-6 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary rotate-45 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-primary"></div></div>
              SECULO <span className="text-[10px] text-primary mt-1">V.4</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed font-mono uppercase tracking-widest">© 2026 Seculo. All rights reserved. Engineered by the OpenClaw Lab.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div>
              <div className="text-small-cap text-[10px] font-black text-white mb-6">Product</div>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('features')} className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium bg-transparent border-none cursor-pointer">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium bg-transparent border-none cursor-pointer">Pricing</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium bg-transparent border-none cursor-pointer">Setup Guide</button></li>
              </ul>
            </div>
            <div>
              <div className="text-small-cap text-[10px] font-black text-white mb-6">Resources</div>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('faq')} className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium bg-transparent border-none cursor-pointer">FAQ</button></li>
                <li><a className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Gemini API</a></li>
                <li><span className="text-xs text-on-surface-variant cursor-default">Status</span></li>
              </ul>
            </div>
            <div>
              <div className="text-small-cap text-[10px] font-black text-white mb-6">Legal</div>
              <ul className="space-y-3">
                <li><span className="text-xs text-on-surface-variant cursor-default">Privacy</span></li>
                <li><span className="text-xs text-on-surface-variant cursor-default">Terms</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
