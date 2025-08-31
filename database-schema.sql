-- MoveMail Pro Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create moving_companies table
CREATE TABLE IF NOT EXISTS moving_companies (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    phone TEXT,
    service_area TEXT,
    promo_code TEXT,
    trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    credits INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    subscription_status TEXT DEFAULT 'trial',
    subscription_plan TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES moving_companies(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT,
    price DECIMAL(10,2),
    property_type TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    square_feet INTEGER,
    lead_status TEXT DEFAULT 'new',
    contact_info JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_preferences table
CREATE TABLE IF NOT EXISTS company_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES moving_companies(id) ON DELETE CASCADE,
    province TEXT NOT NULL,
    cities TEXT[],
    service_radius INTEGER DEFAULT 50,
    preferred_property_types TEXT[],
    price_range_min DECIMAL(10,2),
    price_range_max DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, province)
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES moving_companies(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL, -- 'purchase', 'usage', 'refund', 'bonus'
    amount INTEGER NOT NULL,
    description TEXT,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead_access_logs table
CREATE TABLE IF NOT EXISTS lead_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES moving_companies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'view', 'contact', 'bookmark'
    credits_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE moving_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_access_logs ENABLE ROW LEVEL SECURITY;

-- Moving companies can only see their own data
CREATE POLICY "Users can view own company profile" ON moving_companies
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own company profile" ON moving_companies
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own company profile" ON moving_companies
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies can only see leads they have access to
CREATE POLICY "Companies can view accessible leads" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM lead_access_logs 
            WHERE lead_access_logs.lead_id = leads.id 
            AND lead_access_logs.company_id = auth.uid()
        )
    );

-- Companies can only see their own preferences
CREATE POLICY "Companies can view own preferences" ON company_preferences
    FOR SELECT USING (company_id = auth.uid());

CREATE POLICY "Companies can insert own preferences" ON company_preferences
    FOR INSERT WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can update own preferences" ON company_preferences
    FOR UPDATE USING (company_id = auth.uid());

-- Companies can only see their own credit transactions
CREATE POLICY "Companies can view own transactions" ON credit_transactions
    FOR SELECT USING (company_id = auth.uid());

CREATE POLICY "Companies can insert own transactions" ON credit_transactions
    FOR INSERT WITH CHECK (company_id = auth.uid());

-- Companies can only see their own lead access logs
CREATE POLICY "Companies can view own access logs" ON lead_access_logs
    FOR SELECT USING (company_id = auth.uid());

CREATE POLICY "Companies can insert own access logs" ON lead_access_logs
    FOR INSERT WITH CHECK (company_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_company_id ON leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_province ON leads(province);
CREATE INDEX IF NOT EXISTS idx_leads_price ON leads(price);
CREATE INDEX IF NOT EXISTS idx_company_preferences_company_id ON company_preferences(company_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_company_id ON credit_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_lead_access_logs_company_id ON lead_access_logs(company_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_moving_companies_updated_at 
    BEFORE UPDATE ON moving_companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_preferences_updated_at 
    BEFORE UPDATE ON company_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to check if company has enough credits
CREATE OR REPLACE FUNCTION check_company_credits(company_uuid UUID, required_credits INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    available_credits INTEGER;
BEGIN
    SELECT credits INTO available_credits 
    FROM moving_companies 
    WHERE id = company_uuid;
    
    RETURN available_credits >= required_credits;
END;
$$ LANGUAGE plpgsql;

-- Create function to deduct credits when accessing leads
CREATE OR REPLACE FUNCTION deduct_lead_credits(company_uuid UUID, lead_uuid UUID, credits_to_deduct INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if company has enough credits
    IF NOT check_company_credits(company_uuid, credits_to_deduct) THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct credits
    UPDATE moving_companies 
    SET credits = credits - credits_to_deduct 
    WHERE id = company_uuid;
    
    -- Log the transaction
    INSERT INTO credit_transactions (company_id, transaction_type, amount, description)
    VALUES (company_uuid, 'usage', -credits_to_deduct, 'Lead access');
    
    -- Log the lead access
    INSERT INTO lead_access_logs (company_id, lead_id, action, credits_spent)
    VALUES (company_uuid, lead_uuid, 'view', credits_to_deduct);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (optional)
INSERT INTO moving_companies (id, email, company_name, phone, service_area, credits, subscription_status)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo Movers', '+1234567890', 'ontario', 100, 'trial')
ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
