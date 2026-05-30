-- SEED DATA FOR O2-CLINIC (Run this to populate empty live database)

-- 1. Insert Default Dummy Medicines
INSERT INTO public.products (name, name_hi, price, category, requires_prescription, in_stock, image) VALUES
('Paracetamol 500mg', 'पैरासिटामोल 500mg', 25, 'fever_cold', false, true, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&h=200&q=80'),
('Crocin Advance', 'क्रोसिन एडवांस', 30, 'fever_cold', false, true, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&h=200&q=80'),
('Dolo 650', 'डोलो 650', 32, 'fever_cold', false, true, 'https://images.unsplash.com/photo-1607619275048-24722480f876?auto=format&fit=crop&w=200&h=200&q=80'),
('Combiflam Tablet', 'कॉम्बिफ्लेम टैबलेट', 35, 'pain_relief', false, true, 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=200&h=200&q=80'),
('Ibuprofen 400mg', 'इबुप्रोफेन 400mg', 28, 'pain_relief', false, true, 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=200&h=200&q=80'),
('Vicks VapoRub', 'विक्स वेपोरब', 75, 'fever_cold', false, true, 'https://images.unsplash.com/photo-1555364376-7910cf94e9f7?auto=format&fit=crop&w=200&h=200&q=80'),
('ORS Sachet', 'ORS सैशे', 12, 'general', false, true, 'https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?auto=format&fit=crop&w=200&h=200&q=80'),
('Cetirizine 10mg', 'सिट्रिजीन 10mg', 18, 'general', false, true, 'https://images.unsplash.com/photo-1587854692152-cbe660dbbc88?auto=format&fit=crop&w=200&h=200&q=80'),
('Vitamin C Tablets', 'विटामिन C टैबलेट', 120, 'vitamins', false, true, 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&w=200&h=200&q=80'),
('Multivitamin Capsules', 'मल्टीविटामिन कैप्सूल', 180, 'vitamins', false, true, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&h=200&q=80'),
('Calcium + D3 Tablets', 'कैल्शियम + D3 टैबलेट', 150, 'vitamins', false, true, 'https://images.unsplash.com/photo-1550572017-ed3c2cbe0df0?auto=format&fit=crop&w=200&h=200&q=80'),
('Dettol Antiseptic', 'डेटॉल एंटीसेप्टिक', 65, 'first_aid', false, true, 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=200&h=200&q=80'),
('Band-Aid Strips (10)', 'बैंड-एड स्ट्रिप्स (10)', 40, 'first_aid', false, true, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=200&h=200&q=80'),
('Cotton Roll', 'कॉटन रोल', 30, 'first_aid', false, true, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=200&h=200&q=80'),
('Burnol Cream', 'बर्नोल क्रीम', 55, 'first_aid', false, true, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=200&h=200&q=80'),
('Metformin 500mg', 'मेटफॉर्मिन 500mg', 45, 'diabetes', true, true, 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=200&h=200&q=80');

-- 2. Insert Default Blood Tests
INSERT INTO public.blood_test_types (name, name_hi, price, mrp, offer) VALUES
('Complete Blood Count (CBC)', 'कम्पलीट ब्लड काउंट (CBC)', 350, 500, '30% off'),
('Blood Sugar (Fasting)', 'ब्लड शुगर (फास्टिंग)', 150, 200, '25% off'),
('Thyroid Profile', 'थायरॉइड प्रोफाइल', 600, 800, '25% off'),
('Lipid Profile', 'लिपिड प्रोफाइल', 500, 700, '28% off'),
('Liver Function Test', 'लिवर फंक्शन टेस्ट', 550, 800, '31% off'),
('Kidney Function Test', 'किडनी फंक्शन टेस्ट', 500, 750, '33% off'),
('Urine Routine', 'यूरिन रूटीन', 200, 300, '33% off'),
('Vitamin D', 'विटामिन D', 800, 1200, '33% off'),
('HbA1c', 'HbA1c', 450, 600, '25% off'),
('Diabetes Screen (Fasting Sugar + HbA1c)', 'डायबिटीज स्क्रीन', 500, 650, '23% off'),
('Full Body Health Checkup', 'फुल बॉडी हेल्थ चेकअप', 1200, 2000, '40% off'),
('Vitamin B12 Test', 'विटामिन B12 टेस्ट', 700, 900, '22% off'),
('Hemoglobin (Hb) Test', 'हीमोग्लोबिन टेस्ट', 100, 150, '33% off'),
('Malaria & Dengue Screen', 'मलेरिया और डेंगू स्क्रीन', 400, 600, '33% off'),
('Double Marker Test', 'डबल मार्कर टेस्ट', 1500, 1800, '16% off');
