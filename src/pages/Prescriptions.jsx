import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile, uploadPrescription } from '../services/index.js';
import { showToast } from '../components/ui/Toast';
import { FileImage, Camera, Upload, CheckCircle, X, Image } from 'lucide-react';

export default function Prescriptions() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();
  const cameraRef = useRef();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function clearFile() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  }

  async function handleUpload() {
    if (!user || user.id === 'guest') {
      showToast(lang === 'hi' ? 'कृपया पहले लॉगिन करें' : 'Please login first', 'info');
      navigate('/login');
      return;
    }
    if (!file) {
      showToast(lang === 'hi' ? 'कृपया फ़ाइल चुनें' : 'Please select a file', 'error');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadFile(file, 'prescriptions');
      await uploadPrescription({
        user_id: user.id,
        file_url: imageUrl
      });
      setDone(true);
      showToast(lang === 'hi' ? 'प्रिस्क्रिप्शन अपलोड हो गया!' : 'Prescription uploaded!');
    } catch (err) {
      showToast(lang === 'hi' ? 'अपलोड विफल' : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  }

  if (done) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-bounce-gentle mb-6">
          <CheckCircle size={72} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">
          {lang === 'hi' ? 'प्रिस्क्रिप्शन अपलोड हो गया!' : 'Prescription Uploaded!'}
        </h2>
        <p className="text-surface-400 mb-6">
          {lang === 'hi'
            ? 'हम जल्द ही आपसे संपर्क करेंगे।'
            : 'We will contact you shortly with your medicines.'}
        </p>
        <button onClick={() => { setDone(false); clearFile(); }} className="btn-primary">
          {lang === 'hi' ? 'और अपलोड करें' : 'Upload Another'}
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="section-title">{t('prescription_title')}</h2>
      <p className="section-subtitle">{t('prescription_subtitle')}</p>

      {/* Upload Area */}
      <div className="mb-6">
        {preview ? (
          <div className="relative card p-0 overflow-hidden">
            <img src={preview} alt="Prescription" className="w-full max-h-80 object-contain bg-surface-800 rounded-2xl" />
            <button
              onClick={clearFile}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl transition-all hover:bg-red-600 hover:scale-110 active:scale-95 z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className="card border-2 border-dashed border-surface-600 text-center py-16">
            <Image size={48} className="text-surface-600 mx-auto mb-4" />
            <p className="text-surface-400 text-sm mb-6">
              {lang === 'hi'
                ? 'अपने प्रिस्क्रिप्शन की फ़ोटो अपलोड करें'
                : 'Upload a photo of your prescription'}
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => cameraRef.current?.click()}
                className="btn-primary flex items-center gap-2"
                id="rx-camera"
              >
                <Camera size={18} />
                {t('take_photo')}
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="btn-secondary flex items-center gap-2"
                id="rx-file"
              >
                <FileImage size={18} />
                {t('choose_file')}
              </button>
            </div>
          </div>
        )}

        {/* Hidden inputs */}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      </div>

      {/* Upload button */}
      {preview && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
          id="rx-upload"
        >
          {uploading ? '⏳' : <Upload size={20} />}
          {t('upload')}
        </button>
      )}

      {/* Info */}
      <div className="card mt-6 bg-blue-500/5 border-blue-500/20">
        <h4 className="font-bold text-sm text-blue-400 mb-2">
          {lang === 'hi' ? 'ℹ️ ज़रूरी जानकारी' : 'ℹ️ Important Info'}
        </h4>
        <ul className="text-surface-400 text-xs space-y-1">
          <li>• {lang === 'hi' ? 'साफ़ और पढ़ने योग्य फ़ोटो लें' : 'Take a clear, readable photo'}</li>
          <li>• {lang === 'hi' ? 'डॉक्टर का नाम दिखना चाहिए' : "Doctor's name should be visible"}</li>
          <li>• {lang === 'hi' ? 'हम OTC दवाइयाँ ही भेजते हैं' : 'We only deliver OTC medicines'}</li>
        </ul>
      </div>
    </div>
  );
}
