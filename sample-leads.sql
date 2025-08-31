-- Sample Leads Data for MoveMail Pro
-- Run this in your Supabase SQL editor after creating the database schema

-- Insert sample leads (these will be available to all companies)
INSERT INTO leads (address, city, province, postal_code, price, property_type, bedrooms, bathrooms, square_feet, lead_status, contact_info, notes) VALUES
-- Ontario Leads
('123 Maple Street', 'Toronto', 'Ontario', 'M5V 2H1', 850000, 'house', 3, 2, 1800, 'new', '{"phone": "+1-416-555-0101", "email": "seller@example.com"}', 'Family moving to Vancouver, needs quick sale'),
('456 Oak Avenue', 'Mississauga', 'Ontario', 'L5B 2C9', 720000, 'house', 4, 3, 2200, 'new', '{"phone": "+1-905-555-0202", "email": "owner@example.com"}', 'Relocating for work, flexible on timing'),
('789 Pine Road', 'Brampton', 'Ontario', 'L6T 0E1', 680000, 'house', 3, 2, 1900, 'new', '{"phone": "+1-905-555-0303", "email": "contact@example.com"}', 'Downsizing, house in good condition'),
('321 Elm Drive', 'Markham', 'Ontario', 'L3R 9V6', 950000, 'house', 4, 3, 2400, 'new', '{"phone": "+1-905-555-0404", "email": "info@example.com"}', 'Moving to Calgary, motivated seller'),
('654 Birch Lane', 'Richmond Hill', 'Ontario', 'L4C 9M8', 1100000, 'house', 5, 4, 2800, 'new', '{"phone": "+1-905-555-0505", "email": "seller@example.com"}', 'Luxury home, international relocation'),

-- British Columbia Leads
('987 Cedar Court', 'Vancouver', 'British Columbia', 'V6B 1A1', 1200000, 'house', 3, 2, 2000, 'new', '{"phone": "+1-604-555-0606", "email": "owner@example.com"}', 'Moving to Toronto, needs moving services'),
('147 Spruce Way', 'Surrey', 'British Columbia', 'V3T 1V8', 850000, 'house', 4, 3, 2200, 'new', '{"phone": "+1-604-555-0707", "email": "contact@example.com"}', 'Family expanding, needs larger home'),
('258 Fir Street', 'Burnaby', 'British Columbia', 'V5H 1Z7', 950000, 'house', 3, 2, 1900, 'new', '{"phone": "+1-604-555-0808", "email": "seller@example.com"}', 'Job transfer to Edmonton'),
('369 Willow Road', 'Coquitlam', 'British Columbia', 'V3K 6Y5', 780000, 'house', 4, 3, 2100, 'new', '{"phone": "+1-604-555-0909", "email": "info@example.com"}', 'Retiring to Victoria, quick sale needed'),
('741 Aspen Drive', 'Langley', 'British Columbia', 'V2Y 1P4', 720000, 'house', 3, 2, 1800, 'new', '{"phone": "+1-604-555-1010", "email": "owner@example.com"}', 'Moving to Kelowna, flexible on price'),

-- Alberta Leads
('852 Poplar Lane', 'Calgary', 'Alberta', 'T2P 1J9', 650000, 'house', 4, 3, 2000, 'new', '{"phone": "+1-403-555-1111", "email": "seller@example.com"}', 'Job relocation to Toronto'),
('963 Maple Avenue', 'Edmonton', 'Alberta', 'T5J 0R2', 580000, 'house', 3, 2, 1700, 'new', '{"phone": "+1-780-555-1212", "email": "contact@example.com"}', 'Moving to Vancouver for family'),
('159 Oak Street', 'Red Deer', 'Alberta', 'T4N 1A1', 420000, 'house', 3, 2, 1600, 'new', '{"phone": "+1-403-555-1313", "email": "owner@example.com"}', 'Relocating to Calgary'),
('357 Pine Road', 'Lethbridge', 'Alberta', 'T1J 1Y1', 380000, 'house', 2, 2, 1400, 'new', '{"phone": "+1-403-555-1414", "email": "info@example.com"}', 'Moving to Edmonton for work'),
('468 Elm Drive', 'Medicine Hat', 'Alberta', 'T1A 1A1', 320000, 'house', 3, 2, 1500, 'new', '{"phone": "+1-403-555-1515", "email": "seller@example.com"}', 'Retiring to Victoria'),

-- Quebec Leads
('579 Cedar Court', 'Montreal', 'Quebec', 'H2Y 1C6', 750000, 'house', 3, 2, 1800, 'new', '{"phone": "+1-514-555-1616", "email": "owner@example.com"}', 'Moving to Toronto for business'),
('681 Spruce Way', 'Quebec City', 'Quebec', 'G1R 4P3', 680000, 'house', 4, 3, 2000, 'new', '{"phone": "+1-418-555-1717", "email": "contact@example.com"}', 'Relocating to Vancouver'),
('792 Fir Street', 'Laval', 'Quebec', 'H7N 1L3', 720000, 'house', 3, 2, 1900, 'new', '{"phone": "+1-450-555-1818", "email": "seller@example.com"}', 'Moving to Calgary for job'),
('813 Willow Road', 'Gatineau', 'Quebec', 'J8X 1A1', 650000, 'house', 4, 3, 2100, 'new', '{"phone": "+1-819-555-1919", "email": "info@example.com"}', 'Relocating to Edmonton'),
('924 Aspen Drive', 'Longueuil', 'Quebec', 'J4K 1A1', 690000, 'house', 3, 2, 1800, 'new', '{"phone": "+1-450-555-2020", "email": "owner@example.com"}', 'Moving to Toronto for family'),

-- Nova Scotia Leads
('135 Poplar Lane', 'Halifax', 'Nova Scotia', 'B3J 1S9', 580000, 'house', 3, 2, 1700, 'new', '{"phone": "+1-902-555-2121", "email": "seller@example.com"}', 'Relocating to Vancouver'),
('246 Maple Avenue', 'Dartmouth', 'Nova Scotia', 'B2Y 1A1', 520000, 'house', 4, 3, 1900, 'new', '{"phone": "+1-902-555-2222", "email": "contact@example.com"}', 'Moving to Toronto for work'),
('357 Oak Street', 'Sydney', 'Nova Scotia', 'B1P 1A1', 380000, 'house', 3, 2, 1500, 'new', '{"phone": "+1-902-555-2323", "email": "owner@example.com"}', 'Relocating to Calgary'),
('468 Pine Road', 'Truro', 'Nova Scotia', 'B2N 1A1', 320000, 'house', 2, 2, 1300, 'new', '{"phone": "+1-902-555-2424", "email": "info@example.com"}', 'Moving to Edmonton'),
('579 Elm Drive', 'New Glasgow', 'Nova Scotia', 'B2H 1A1', 280000, 'house', 3, 2, 1400, 'new', '{"phone": "+1-902-555-2525", "email": "seller@example.com"}', 'Relocating to Toronto'),

-- Manitoba Leads
('681 Cedar Court', 'Winnipeg', 'Manitoba', 'R3C 0P8', 480000, 'house', 3, 2, 1600, 'new', '{"phone": "+1-204-555-2626", "email": "owner@example.com"}', 'Moving to Vancouver for family'),
('792 Spruce Way', 'Brandon', 'Manitoba', 'R7A 1A1', 380000, 'house', 4, 3, 1800, 'new', '{"phone": "+1-204-555-2727", "email": "contact@example.com"}', 'Relocating to Toronto'),
('813 Fir Street', 'Steinbach', 'Manitoba', 'R5G 1A1', 320000, 'house', 3, 2, 1500, 'new', '{"phone": "+1-204-555-2828", "email": "seller@example.com"}', 'Moving to Calgary for work'),
('924 Willow Road', 'Thompson', 'Manitoba', 'R8N 1A1', 280000, 'house', 2, 2, 1200, 'new', '{"phone": "+1-204-555-2929", "email": "info@example.com"}', 'Relocating to Edmonton'),
('135 Aspen Drive', 'Portage la Prairie', 'Manitoba', 'R1N 1A1', 260000, 'house', 3, 2, 1400, 'new', '{"phone": "+1-204-555-3030", "email": "owner@example.com"}', 'Moving to Toronto'),

-- Saskatchewan Leads
('246 Poplar Lane', 'Regina', 'Saskatchewan', 'S4P 1A1', 420000, 'house', 3, 2, 1600, 'new', '{"phone": "+1-306-555-3131", "email": "seller@example.com"}', 'Relocating to Vancouver'),
('357 Maple Avenue', 'Saskatoon', 'Saskatchewan', 'S7K 1A1', 480000, 'house', 4, 3, 1900, 'new', '{"phone": "+1-306-555-3232", "email": "contact@example.com"}', 'Moving to Toronto for work'),
('468 Oak Street', 'Prince Albert', 'Saskatchewan', 'S6V 1A1', 320000, 'house', 3, 2, 1500, 'new', '{"phone": "+1-306-555-3333", "email": "owner@example.com"}', 'Relocating to Calgary'),
('579 Pine Road', 'Moose Jaw', 'Saskatchewan', 'S6H 1A1', 280000, 'house', 2, 2, 1300, 'new', '{"phone": "+1-306-555-3434", "email": "info@example.com"}', 'Moving to Edmonton'),
('681 Elm Drive', 'Swift Current', 'Saskatchewan', 'S9H 1A1', 240000, 'house', 3, 2, 1400, 'new', '{"phone": "+1-306-555-3535", "email": "seller@example.com"}', 'Relocating to Toronto'),

-- Apartment/Condo Leads
('123 Downtown Tower', 'Toronto', 'Ontario', 'M5V 2H1', 650000, 'apartment', 2, 2, 1200, 'new', '{"phone": "+1-416-555-3636", "email": "owner@example.com"}', 'Luxury downtown condo, moving to Vancouver'),
('456 City Center', 'Vancouver', 'British Columbia', 'V6B 1A1', 850000, 'apartment', 2, 2, 1100, 'new', '{"phone": "+1-604-555-3737", "email": "seller@example.com"}', 'Waterfront condo, relocating to Toronto'),
('789 Urban Heights', 'Calgary', 'Alberta', 'T2P 1J9', 480000, 'apartment', 1, 1, 800, 'new', '{"phone": "+1-403-555-3838", "email": "contact@example.com"}', 'Downtown apartment, moving to Edmonton'),
('321 Metro Plaza', 'Montreal', 'Quebec', 'H2Y 1C6', 580000, 'apartment', 2, 2, 1000, 'new', '{"phone": "+1-514-555-3939", "email": "info@example.com"}', 'City center apartment, relocating to Toronto'),
('654 Harbor View', 'Halifax', 'Nova Scotia', 'B3J 1S9', 420000, 'apartment', 2, 1, 900, 'new', '{"phone": "+1-902-555-4040", "email": "owner@example.com"}', 'Harbor view condo, moving to Vancouver'),

-- Townhouse Leads
('987 Suburban Court', 'Mississauga', 'Ontario', 'L5B 2C9', 720000, 'townhouse', 3, 3, 1800, 'new', '{"phone": "+1-905-555-4141", "email": "seller@example.com"}', 'Family townhouse, relocating to Calgary'),
('147 Garden Estates', 'Surrey', 'British Columbia', 'V3T 1V8', 680000, 'townhouse', 3, 2, 1700, 'new', '{"phone": "+1-604-555-4242", "email": "contact@example.com"}', 'Garden townhouse, moving to Toronto'),
('258 Heritage Lane', 'Edmonton', 'Alberta', 'T5J 0R2', 520000, 'townhouse', 2, 2, 1400, 'new', '{"phone": "+1-780-555-4343", "email": "owner@example.com"}', 'Heritage townhouse, relocating to Vancouver'),
('369 Riverside', 'Quebec City', 'Quebec', 'G1R 4P3', 580000, 'townhouse', 3, 2, 1600, 'new', '{"phone": "+1-418-555-4444", "email": "info@example.com"}', 'Riverside townhouse, moving to Toronto'),
('741 Valley View', 'Winnipeg', 'Manitoba', 'R3C 0P8', 420000, 'townhouse', 3, 2, 1500, 'new', '{"phone": "+1-204-555-4545", "email": "seller@example.com"}', 'Valley view townhouse, relocating to Calgary');

-- Update the created_at timestamp to be more recent
UPDATE leads SET created_at = NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30);

-- Add some variety to lead statuses
UPDATE leads SET lead_status = CASE 
    WHEN RANDOM() < 0.7 THEN 'new'
    WHEN RANDOM() < 0.85 THEN 'contacted'
    WHEN RANDOM() < 0.95 THEN 'quoted'
    ELSE 'booked'
END;

-- Add some price variations
UPDATE leads SET price = price * (0.9 + RANDOM() * 0.2);

-- Add some notes variations
UPDATE leads SET notes = CASE 
    WHEN RANDOM() < 0.3 THEN notes || ' - Motivated seller'
    WHEN RANDOM() < 0.6 THEN notes || ' - Quick closing preferred'
    WHEN RANDOM() < 0.8 THEN notes || ' - Open to offers'
    ELSE notes || ' - Flexible on timing'
END;
