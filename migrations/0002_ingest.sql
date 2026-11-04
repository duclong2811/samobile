-- Automatic news ingestion: configured sources, a per-item ledger, and runtime switches.
CREATE TABLE sources (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  url              TEXT NOT NULL UNIQUE,
  language         TEXT NOT NULL CHECK (language IN ('en', 'ko')),
  default_category TEXT NOT NULL DEFAULT 'general' CHECK (default_category IN ('general', 'visa', 'labor', 'tax', 'health', 'life')),
  enabled          INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  created_at       TEXT NOT NULL,
  last_run_at      TEXT,
  last_error       TEXT
);

-- One row per feed item we have looked at, so nothing is translated (and paid for) twice.
CREATE TABLE ingest_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id  TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  item_key   TEXT NOT NULL,
  url        TEXT NOT NULL,
  title      TEXT NOT NULL,
  status     TEXT NOT NULL CHECK (status IN ('published', 'held', 'skipped', 'failed')),
  reason     TEXT,
  attempts   INTEGER NOT NULL DEFAULT 1,
  article_id TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (source_id, item_key)
);
CREATE INDEX idx_ingest_items_created ON ingest_items (created_at DESC);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
-- Safe defaults: ingestion is OFF until the owner switches it on; sensitive topics wait for review.
INSERT INTO settings (key, value) VALUES ('ingest_enabled', '0'), ('hold_sensitive', '1');
