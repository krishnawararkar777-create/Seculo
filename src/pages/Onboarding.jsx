import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const API_BASE_URL = 'https://seculo-2.onrender.com/api';

const countries = [
  { code: 'AF', dial: '+93', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', dial: '+355', name: 'Albania', flag: '🇦🇱' },
  { code: 'DZ', dial: '+213', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AD', dial: '+376', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AO', dial: '+244', name: 'Angola', flag: '🇦🇴' },
  { code: 'AG', dial: '+1', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: 'AR', dial: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AM', dial: '+374', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', dial: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: 'AZ', dial: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BS', dial: '+1', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BH', dial: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', dial: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BB', dial: '+1', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BY', dial: '+375', name: 'Belarus', flag: '🇧🇾' },
  { code: 'BE', dial: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BZ', dial: '+501', name: 'Belize', flag: '🇧🇿' },
  { code: 'BJ', dial: '+229', name: 'Benin', flag: '🇧🇯' },
  { code: 'BT', dial: '+975', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'BO', dial: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BA', dial: '+387', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BW', dial: '+267', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BR', dial: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BN', dial: '+673', name: 'Brunei', flag: '🇧🇳' },
  { code: 'BG', dial: '+359', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BF', dial: '+226', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', dial: '+257', name: 'Burundi', flag: '🇧🇮' },
  { code: 'KH', dial: '+855', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'CM', dial: '+237', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CA', dial: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'CV', dial: '+238', name: 'Cape Verde', flag: '🇨🇻' },
  { code: 'CF', dial: '+236', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'TD', dial: '+235', name: 'Chad', flag: '🇹🇩' },
  { code: 'CL', dial: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', dial: '+86', name: 'China', flag: '🇨🇳' },
  { code: 'CO', dial: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: 'KM', dial: '+269', name: 'Comoros', flag: '🇰🇲' },
  { code: 'CG', dial: '+242', name: 'Congo', flag: '🇨🇬' },
  { code: 'CD', dial: '+243', name: 'Congo (Democratic Republic)', flag: '🇨🇩' },
  { code: 'CR', dial: '+506', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'HR', dial: '+385', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CU', dial: '+53', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CY', dial: '+357', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', dial: '+420', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DK', dial: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: 'DJ', dial: '+253', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'DM', dial: '+1', name: 'Dominica', flag: '🇩🇲' },
  { code: 'DO', dial: '+1', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'EC', dial: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EG', dial: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SV', dial: '+503', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'GQ', dial: '+240', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'ER', dial: '+291', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'EE', dial: '+372', name: 'Estonia', flag: '🇪🇪' },
  { code: 'SZ', dial: '+268', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'ET', dial: '+251', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FJ', dial: '+679', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FI', dial: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', dial: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'GA', dial: '+241', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', dial: '+220', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GE', dial: '+995', name: 'Georgia', flag: '🇬🇪' },
  { code: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', dial: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GR', dial: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: 'GD', dial: '+1', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GT', dial: '+502', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GN', dial: '+224', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GW', dial: '+245', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'GY', dial: '+592', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HT', dial: '+509', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HN', dial: '+504', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HU', dial: '+36', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IS', dial: '+354', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'ID', dial: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IR', dial: '+98', name: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', dial: '+964', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IE', dial: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', dial: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', dial: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: 'JM', dial: '+1', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', dial: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'JO', dial: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KZ', dial: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', dial: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KI', dial: '+686', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KW', dial: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'KG', dial: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'LA', dial: '+856', name: 'Laos', flag: '🇱🇦' },
  { code: 'LV', dial: '+371', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LB', dial: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'LS', dial: '+266', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LR', dial: '+231', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', dial: '+218', name: 'Libya', flag: '🇱🇾' },
  { code: 'LI', dial: '+423', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', dial: '+370', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', dial: '+352', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MG', dial: '+261', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MW', dial: '+265', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MY', dial: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MV', dial: '+960', name: 'Maldives', flag: '🇲🇻' },
  { code: 'ML', dial: '+223', name: 'Mali', flag: '🇲🇱' },
  { code: 'MT', dial: '+356', name: 'Malta', flag: '🇲🇹' },
  { code: 'MH', dial: '+692', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: 'MR', dial: '+222', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MU', dial: '+230', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MX', dial: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: 'FM', dial: '+691', name: 'Micronesia', flag: '🇫🇲' },
  { code: 'MD', dial: '+373', name: 'Moldova', flag: '🇲🇩' },
  { code: 'MC', dial: '+377', name: 'Monaco', flag: '🇲🇨' },
  { code: 'MN', dial: '+976', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'ME', dial: '+382', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MA', dial: '+212', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MZ', dial: '+258', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'MM', dial: '+95', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'NA', dial: '+264', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NR', dial: '+674', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NP', dial: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NL', dial: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', dial: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NI', dial: '+505', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NE', dial: '+227', name: 'Niger', flag: '🇳🇪' },
  { code: 'NG', dial: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'MK', dial: '+389', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'NO', dial: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: 'OM', dial: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: 'PK', dial: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PW', dial: '+680', name: 'Palau', flag: '🇵🇼' },
  { code: 'PS', dial: '+970', name: 'Palestine', flag: '🇵🇸' },
  { code: 'PA', dial: '+507', name: 'Panama', flag: '🇵🇦' },
  { code: 'PG', dial: '+675', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'PY', dial: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', dial: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: 'PH', dial: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', dial: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', dial: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', dial: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', dial: '+40', name: 'Romania', flag: '🇷🇴' },
  { code: 'RU', dial: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: 'RW', dial: '+250', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'KN', dial: '+1', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: 'LC', dial: '+1', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: 'VC', dial: '+1', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: 'WS', dial: '+685', name: 'Samoa', flag: '🇼🇸' },
  { code: 'SM', dial: '+378', name: 'San Marino', flag: '🇸🇲' },
  { code: 'ST', dial: '+239', name: 'Sao Tome and Principe', flag: '🇸🇹' },
  { code: 'SA', dial: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SN', dial: '+221', name: 'Senegal', flag: '🇸🇳' },
  { code: 'RS', dial: '+381', name: 'Serbia', flag: '🇷🇸' },
  { code: 'SC', dial: '+248', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', dial: '+232', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SK', dial: '+421', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', dial: '+386', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SB', dial: '+677', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: 'SO', dial: '+252', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ZA', dial: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', dial: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SS', dial: '+211', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'ES', dial: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: 'LK', dial: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SD', dial: '+249', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SR', dial: '+597', name: 'Suriname', flag: '🇸🇷' },
  { code: 'SE', dial: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', dial: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SY', dial: '+963', name: 'Syria', flag: '🇸🇾' },
  { code: 'TW', dial: '+886', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TJ', dial: '+992', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TZ', dial: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'TH', dial: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TL', dial: '+670', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: 'TG', dial: '+228', name: 'Togo', flag: '🇹🇬' },
  { code: 'TO', dial: '+676', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TT', dial: '+1', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'TN', dial: '+216', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'TR', dial: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: 'TM', dial: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'TV', dial: '+688', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'UG', dial: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', dial: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'AE', dial: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', dial: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', dial: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'UY', dial: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', dial: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VU', dial: '+678', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'VA', dial: '+39', name: 'Vatican City', flag: '🇻🇦' },
  { code: 'VE', dial: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', dial: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', dial: '+967', name: 'Yemen', flag: '🇾🇪' },
  { code: 'ZM', dial: '+260', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', dial: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [animatingStep, setAnimatingStep] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const defaultCountry = countries.find(c => c.code === 'IN') || countries[0];
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const search = countrySearch.toLowerCase().trim();
    return countries.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search)
    );
  }, [countrySearch]);

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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a2a3a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #25D366;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #25D366;
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
                      onClick={() => {
                        setShowCountryDropdown(!showCountryDropdown);
                        setCountrySearch('');
                        setTimeout(() => searchInputRef.current?.focus(), 50);
                      }}
                      className="w-full bg-[#1b1b20] h-14 rounded-xl border border-[#2a2a3a] px-4 flex items-center justify-between group focus:border-[#25D366] transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-[#25D366] font-semibold">{selectedCountry.dial}</span>
                      </span>
                      <span className="text-[#bbcbb9] group-hover:text-[#25D366] transition-colors">▼</span>
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl overflow-hidden shadow-xl z-[9999]" style={{ minWidth: '320px' }}>
                        <div className="p-2 border-b border-[#2a2a3a]">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search country..."
                            className="w-full bg-[#111118] text-[#e4e1e9] placeholder:text-[#bbcbb9]/50 px-3 py-2 rounded-lg border border-[#2a2a3a] focus:border-[#25D366] focus:outline-none transition-all text-sm"
                          />
                        </div>
                        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                          {filteredCountries.length === 0 ? (
                            <div className="px-4 py-6 text-center text-[#bbcbb9]/50 text-sm">No countries found</div>
                          ) : (
                            filteredCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => selectCountry(c)}
                                className={`w-full flex items-center gap-2 hover:bg-[#2a2a3a] transition-colors ${
                                  selectedCountry.code === c.code ? 'bg-[#25D366]/10' : ''
                                }`}
                                style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}
                              >
                                <span style={{ fontSize: '24px', width: '24px', flexShrink: 0 }}>{c.flag}</span>
                                <span className="text-[#bbcbb9]/60 text-xs font-mono" style={{ minWidth: '32px' }}>{c.code}</span>
                                <span className="text-[#25D366] text-sm font-semibold" style={{ minWidth: '52px' }}>{c.dial}</span>
                                <span className="text-[#e4e1e9] text-sm flex-1 text-left overflow-hidden text-ellipsis">{c.name}</span>
                              </button>
                            ))
                          )}
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
