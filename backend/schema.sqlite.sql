-- =============================================================================
-- SQLite3 Schema for Supply Chain & Batch Tracking System (MVP)
-- Version: 1.0.0
-- Author: Senior Backend Engineer
-- 
-- MIGRATION NOTES (to PostgreSQL):
-- 1. Replace TEXT primary keys with UUID type (or keep as UUID).
-- 2. Convert CHECK constraints on TEXT columns to true ENUM types.
-- 3. Convert ISO8601 TEXT dates to TIMESTAMPTZ.
-- 4. Convert INTEGER booleans (0/1) to BOOLEAN type.
-- 5. Replace 'REAL' with 'NUMERIC' for high-precision quantities if needed.
-- 6. Re-implement Triggers using PL/PGSQL for robust auditing.
-- =============================================================================

-- 0. CONFIGURATION
-- Enable Foreign Keys (Must be done per connection in SQLite, but good to document)
PRAGMA foreign_keys = ON;
-- Enable Write-Ahead Logging for concurrency
PRAGMA journal_mode = WAL;

-- 1. ORGANIZATIONS
-- Top-level entities.
CREATE TABLE organizations (
    id TEXT PRIMARY KEY, -- UUID
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Producer', 'Aggregator', 'Exporter')),
    address TEXT,
    contact_email TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')), -- ISO8601
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    CONSTRAINT check_org_name_length CHECK (length(name) >= 2)
);

CREATE INDEX idx_orgs_type ON organizations(type);

-- 2. PRODUCTION SITES
-- Child entities of Organizations (primarily for Producers).
-- "Farm A", "Processing Center B"
CREATE TABLE production_sites (
    id TEXT PRIMARY KEY, -- UUID
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    location_text TEXT, -- "Kenya, Kiambu County..."
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE INDEX idx_sites_org ON production_sites(organization_id);

-- 3. USERS
-- RBAC: Users belong to an Organization.
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- UUID
    organization_id TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Producer', 'Aggregator', 'Exporter')),
    is_active INTEGER NOT NULL DEFAULT 1, -- Boolean: 0 or 1
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT check_email_format CHECK (email LIKE '%_@__%.__%') -- Basic check
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- 4. BATCHES
-- The core entity tracking produce.
CREATE TABLE batches (
    id TEXT PRIMARY KEY, -- UUID
    organization_id TEXT NOT NULL, -- Current Owner
    site_id TEXT, -- Origin Site (optional if created by Aggregator)
    
    public_token TEXT NOT NULL UNIQUE, -- For QR/Public tracking
    
    product_type TEXT NOT NULL, -- "Avocado", "Coffee"
    strain_or_variety TEXT, -- "Hass", "Arabica"
    
    quantity REAL NOT NULL CHECK (quantity >= 0),
    unit_of_measure TEXT NOT NULL DEFAULT 'KG',
    
    status TEXT NOT NULL DEFAULT 'Created' CHECK (
        status IN (
            'Created', 
            'ReadyForTransfer', 
            'InTransit', 
            'Received', 
            'Processed', 
            'Closed'
        )
    ),
    
    harvest_date TEXT NOT NULL, -- ISO8601
    process_date TEXT, -- ISO8601
    
    created_by_user_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE RESTRICT,
    FOREIGN KEY (site_id) REFERENCES production_sites(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_batches_org ON batches(organization_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_public_token ON batches(public_token);
CREATE INDEX idx_batches_harvest_date ON batches(harvest_date);

-- 5. BATCH LINEAGE (Split & Merge)
-- Many-to-Many self-reference standardizing parent/child relationships.
CREATE TABLE batch_lineage (
    parent_batch_id TEXT NOT NULL,
    child_batch_id TEXT NOT NULL,
    quantity_allocated REAL NOT NULL CHECK (quantity_allocated > 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    PRIMARY KEY (parent_batch_id, child_batch_id),
    FOREIGN KEY (parent_batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    FOREIGN KEY (child_batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    CONSTRAINT check_no_self_ref CHECK (parent_batch_id != child_batch_id)
);

CREATE INDEX idx_lineage_child ON batch_lineage(child_batch_id);

-- 6. TRANSFERS (Chain of Custody)
-- Critical for tracking movement between organizations.
CREATE TABLE transfers (
    id TEXT PRIMARY KEY, -- UUID
    batch_id TEXT NOT NULL,
    
    from_organization_id TEXT NOT NULL,
    to_organization_id TEXT NOT NULL,
    
    quantity_transferred REAL NOT NULL CHECK (quantity_transferred > 0),
    
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (
        status IN ('Pending', 'Completed', 'Cancelled')
    ),
    
    initiated_by_user_id TEXT,
    accepted_by_user_id TEXT,
    
    created_at TEXT NOT NULL DEFAULT (datetime('now')), -- Initiated At
    completed_at TEXT,
    
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE RESTRICT,
    FOREIGN KEY (from_organization_id) REFERENCES organizations(id) ON DELETE RESTRICT,
    FOREIGN KEY (to_organization_id) REFERENCES organizations(id) ON DELETE RESTRICT,
    FOREIGN KEY (initiated_by_user_id) REFERENCES users(id),
    FOREIGN KEY (accepted_by_user_id) REFERENCES users(id),
    
    CONSTRAINT check_diff_orgs CHECK (from_organization_id != to_organization_id)
);

CREATE INDEX idx_transfers_batch ON transfers(batch_id);
CREATE INDEX idx_transfers_from_org ON transfers(from_organization_id);
CREATE INDEX idx_transfers_to_org ON transfers(to_organization_id);

-- 7. AUDIT LOGS
-- Immutable record of important actions.
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY, -- UUID
    entity_name TEXT NOT NULL, -- 'batches', 'transfers', etc.
    entity_id TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE', 'TRANSFER')),
    
    changed_by_user_id TEXT,
    
    before_data TEXT, -- JSON string
    after_data TEXT, -- JSON string
    
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(changed_by_user_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);

-- =============================================================================
-- TRIGGERS (Automated Auditing)
-- SQLite triggers are limited, but we can automate 'updated_at' maintenance.
-- Application logic is responsible for inserting into audit_logs for complex actions.
-- =============================================================================

CREATE TRIGGER update_orgs_updated_at 
AFTER UPDATE ON organizations
BEGIN
    UPDATE organizations SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER update_users_updated_at 
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER update_batches_updated_at 
AFTER UPDATE ON batches
BEGIN
    UPDATE batches SET updated_at = datetime('now') WHERE id = OLD.id;
END;
