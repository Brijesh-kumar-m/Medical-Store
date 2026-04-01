-- SEED DATA FOR O2-CLINIC (Run this to populate empty live database)

-- 1. Insert Default Dummy Medicines
INSERT INTO public.products (name, name_hi, price, category, requires_prescription, in_stock) VALUES
('Paracetamol 500mg', 'पैरासिटामोल 500mg', 25, 'fever_cold', false, true),
('Crocin Advance', 'क्रोसिन एडवांस', 30, 'fever_cold', false, true),
('Dolo 650', 'डोलो 650', 32, 'fever_cold', false, true),
('Combiflam Tablet', 'कॉम्बिफ्लेम टैबलेट', 35, 'pain_relief', false, true),
('Ibuprofen 400mg', 'इबुप्रोफेन 400mg', 28, 'pain_relief', false, true),
('Vicks VapoRub', 'विक्स वेपोरब', 75, 'fever_cold', false, true),
('ORS Sachet', 'ORS सैशे', 12, 'general', false, true),
('Cetirizine 10mg', 'सिट्रिजीन 10mg', 18, 'general', false, true),
('Vitamin C Tablets', 'विटामिन C टैबलेट', 120, 'vitamins', false, true),
('Multivitamin Capsules', 'मल्टीविटामिन कैप्सूल', 180, 'vitamins', false, true),
('Calcium + D3 Tablets', 'कैल्शियम + D3 टैबलेट', 150, 'vitamins', false, true),
('Dettol Antiseptic', 'डेटॉल एंटीसेप्टिक', 65, 'first_aid', false, true),
('Band-Aid Strips (10)', 'बैंड-एड स्ट्रिप्स (10)', 40, 'first_aid', false, true),
('Cotton Roll', 'कॉटन रोल', 30, 'first_aid', false, true),
('Burnol Cream', 'बर्नोल क्रीम', 55, 'first_aid', false, true),
('Metformin 500mg', 'मेटफॉर्मिन 500mg', 45, 'diabetes', true, true);

-- 2. Insert Default Blood Tests
INSERT INTO public.blood_test_types (name, name_hi, price) VALUES
('Complete Blood Count (CBC)', 'कम्पलीट ब्लड काउंट (CBC)', 350),
('Blood Sugar (Fasting)', 'ब्लड शुगर (फास्टिंग)', 150),
('Thyroid Profile', 'थायरॉइड प्रोफाइल', 600),
('Lipid Profile', 'लिपिड प्रोफाइल', 500),
('Liver Function Test', 'लिवर फंक्शन टेस्ट', 550),
('Kidney Function Test', 'किडनी फंक्शन टेस्ट', 500),
('Urine Routine', 'यूरिन रूटीन', 200),
('Vitamin D', 'विटामिन D', 800),
('HbA1c', 'HbA1c', 450);
