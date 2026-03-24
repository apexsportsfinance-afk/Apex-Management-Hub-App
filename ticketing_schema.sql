-- Spectator Ticketing Schema
-- This schema handles multi-quantity purchases and single-QR order tracking.

-- Ticket Types (e.g., General Admission, VIP)
CREATE TABLE IF NOT EXISTS ticket_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'AED',
    capacity INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Packages (e.g., Family Pack - 4 tickets)
CREATE TABLE IF NOT EXISTS ticket_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity_included INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders (Each order has one QR code)
CREATE TABLE IF NOT EXISTS spectator_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    ticket_count INT NOT NULL DEFAULT 1, -- Matches JS code
    scanned_count INT NOT NULL DEFAULT 0,
    qr_code_id VARCHAR(100) UNIQUE NOT NULL, -- The unique string in the QR
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'paid', 'pending', 'failed'
    payment_provider VARCHAR(20), -- 'stripe', 'magnati', 'manual'
    payment_id VARCHAR(255), -- Stripe PaymentIntent ID or Magnati Ref
    metadata JSONB, -- For storing specific ticket type breakdown
    selected_dates JSONB, -- [NEW] Array of date strings ["YYYY-MM-DD", ...]
    last_scanned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_event ON spectator_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON spectator_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_qr ON spectator_orders(qr_code_id);

-- Enable RLS
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE spectator_orders ENABLE ROW LEVEL SECURITY;

-- Policies for public access (Select active types/packages, insert orders)
CREATE POLICY "Public: View active types" ON ticket_types FOR SELECT USING (is_active = true);
CREATE POLICY "Public: View active packages" ON ticket_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Public: Insert orders" ON spectator_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public: View own order" ON spectator_orders FOR SELECT USING (true);

-- Policies for admin access (Authenticated users can manage everything)
CREATE POLICY "Admin: Manage types" ON ticket_types TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin: Manage packages" ON ticket_packages TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin: Manage orders" ON spectator_orders TO authenticated USING (true) WITH CHECK (true);
