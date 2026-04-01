import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getBloodTestTypes, bookBloodTest } from '../services/index.js';
import { openWhatsApp, generateBloodTestMessage } from '../utils/whatsapp';
import { showToast } from '../components/ui/Toast';
import { Droplets, Calendar, Clock, MapPin, User, CheckCircle, MessageCircle, ArrowLeft, Tag } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/Loading';

const timeSlots = [
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];

export default function BloodTests() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [step, setStep] = useState(1); // 1=select, 2=details, 3=done
  const [selectedTest, setSelectedTest] = useState(null);
  const [patientName, setPatientName] = useState(user?.name || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingTests, setLoadingTests] = useState(true);

  useEffect(() => {
    async function loadTests() {
      try {
        const data = await getBloodTestTypes();
        setTests(data);
      } catch (err) {
        console.error('Failed to load blood test types:', err);
      } finally {
        setLoadingTests(false);
      }
    }
    loadTests();
  }, []);

  async function handleBook() {
    if (!user || user.id === 'guest') {
      showToast(lang === 'hi' ? 'कृपया पहले लॉगिन करें' : 'Please login first', 'info');
      navigate('/login');
      return;
    }
    if (!patientName || !date || !time || !address) {
      showToast(lang === 'hi' ? 'सभी फ़ील्ड भरें' : 'Please fill all fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const testName = lang === 'hi' && selectedTest.name_hi ? selectedTest.name_hi : selectedTest.name;
      const result = await bookBloodTest({
        user_id: user.id,
        test_type: selectedTest.name,
        test_id: selectedTest.id,
        patient_name: patientName,
        date,
        time,
        address,
        price: selectedTest.price,
      });
      setBooking(result);
      setStep(3);
      showToast(t('booking_confirmed'));
    } catch (err) {
      showToast(lang === 'hi' ? 'बुकिंग विफल' : 'Booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // Step 3: Done
  if (step === 3 && booking) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-bounce-gentle mb-6">
          <CheckCircle size={72} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">{t('booking_confirmed')}</h2>
        <p className="text-surface-400 mb-4">{selectedTest.name}</p>
        <div className="card w-full max-w-sm text-left space-y-2 mb-6">
          <p className="text-sm"><span className="text-surface-400">{t('date')}:</span> {date}</p>
          <p className="text-sm"><span className="text-surface-400">{t('time')}:</span> {time}</p>
          <p className="text-sm"><span className="text-surface-400">{t('address')}:</span> {address}</p>
          <p className="text-sm"><span className="text-surface-400">{t('price')}:</span> <span className="text-brand-400 font-bold">₹{selectedTest.price}</span></p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const msg = generateBloodTestMessage({ test_type: selectedTest.name, patient_name: patientName, date, time, address }, lang);
              openWhatsApp(msg);
            }}
            className="btn-whatsapp"
          >
            <MessageCircle size={18} /> WhatsApp
          </button>
          <button
            onClick={() => { setStep(1); setSelectedTest(null); }}
            className="btn-secondary"
          >
            {lang === 'hi' ? 'नया बुक करें' : 'Book Another'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="section-title">{t('blood_test_title')}</h2>
      <p className="section-subtitle">{t('blood_test_subtitle')}</p>

      {/* Step Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= s ? 'bg-brand-500 text-white' : 'bg-surface-700 text-surface-400'
            }`}>
              {s}
            </div>
            {s < 2 && <div className={`flex-1 h-0.5 rounded ${step > s ? 'bg-brand-500' : 'bg-surface-700'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Test */}
      {step === 1 && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="font-bold text-lg mb-3">{t('select_test')}</h3>
          {loadingTests ? <LoadingSpinner text={t('loading')} /> : tests.map((test) => {
            const name = lang === 'hi' && test.name_hi ? test.name_hi : test.name;
            const isSelected = selectedTest?.id === test.id;
            return (
              <button
                key={test.id}
                onClick={() => setSelectedTest(test)}
                className={`w-full card flex items-center gap-4 ${
                  isSelected ? 'border-brand-500 bg-brand-500/10' : ''
                }`}
                id={`test-${test.id}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-brand-500' : 'bg-blue-500/10'
                }`}>
                  <Droplets size={20} className={isSelected ? 'text-white' : 'text-blue-400'} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-sm leading-tight mb-1">{name}</h4>
                  {test.offer && (
                    <div className="mt-0.5 flex items-center">
                      <span className="text-[#388e3c] font-bold text-[11px] flex items-center gap-1">
                        <Tag size={10} className="fill-[#388e3c]/20" /> {test.offer}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0 flex flex-col items-end justify-center gap-0.5">
                  <span className="font-bold text-lg leading-none mb-0.5">₹{test.price}</span>
                  {test.mrp && Number(test.mrp) > Number(test.price) && (
                    <div className="flex items-center gap-1.5 opacity-90">
                      <span className="text-surface-500 text-xs font-medium line-through leading-none mt-0.5">₹{test.mrp}</span>
                      <span className="text-[#388e3c] font-bold text-[10px] leading-none mt-0.5 tracking-tight">
                        {Math.round(((Number(test.mrp) - Number(test.price)) / Number(test.mrp)) * 100)}% off
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          <button
            onClick={() => selectedTest && setStep(2)}
            disabled={!selectedTest}
            className="btn-primary w-full mt-4 py-4 text-lg disabled:opacity-40"
            id="test-next"
          >
            {t('next')}
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="animate-fade-in">
          <button onClick={() => setStep(1)} className="text-surface-400 flex items-center gap-1 mb-4 text-sm hover:text-white transition-colors">
            <ArrowLeft size={16} /> {t('back')}
          </button>

          <div className="card mb-4 flex items-center gap-3">
            <Droplets size={20} className="text-blue-400" />
            <span className="font-semibold">{lang === 'hi' && selectedTest.name_hi ? selectedTest.name_hi : selectedTest.name}</span>
            <span className="text-brand-400 font-bold ml-auto">₹{selectedTest.price}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="input-label flex items-center gap-2"><User size={14} className="text-brand-400" /> {t('patient_name')}</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t('enter_name')}
                className="w-full"
                id="bt-name"
              />
            </div>

            <div>
              <label className="input-label flex items-center gap-2"><Calendar size={14} className="text-brand-400" /> {t('select_date')}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full"
                id="bt-date"
              />
            </div>

            <div>
              <label className="input-label flex items-center gap-2"><Clock size={14} className="text-brand-400" /> {t('select_time')}</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                      time === slot
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                        : 'bg-surface-800 text-surface-400 border border-surface-600 hover:border-brand-500/50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="input-label flex items-center gap-2"><MapPin size={14} className="text-brand-400" /> {t('patient_address')}</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('enter_address')}
                rows={3}
                className="w-full resize-none"
                id="bt-address"
              />
            </div>

            <button
              onClick={handleBook}
              disabled={submitting}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
              id="bt-submit"
            >
              {submitting ? '⏳' : <Droplets size={20} />}
              {t('book_now')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
