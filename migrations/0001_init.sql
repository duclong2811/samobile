-- SAmobile content store (Cloudflare D1).
-- Articles are language-neutral; every visible text lives in article_translations.
CREATE TABLE articles (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden')),
  category    TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'visa', 'labor', 'tax', 'health', 'life')),
  origin      TEXT NOT NULL DEFAULT 'manual' CHECK (origin IN ('manual', 'auto')),
  source_name TEXT,
  source_url  TEXT,
  published_at TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE TABLE article_translations (
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  locale     TEXT NOT NULL CHECK (locale IN ('en', 'ko', 'vi', 'zh', 'th', 'ne', 'uz')),
  title      TEXT NOT NULL,
  summary    TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  machine_translated INTEGER NOT NULL DEFAULT 0 CHECK (machine_translated IN (0, 1)),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (article_id, locale)
);

CREATE INDEX idx_articles_status_published ON articles (status, published_at DESC);
CREATE INDEX idx_translations_locale ON article_translations (locale, article_id);

-- Every admin mutation is recorded: who, what, when.
CREATE TABLE audit_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  at        TEXT NOT NULL,
  actor     TEXT NOT NULL,
  action    TEXT NOT NULL,
  entity    TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  detail    TEXT
);
CREATE INDEX idx_audit_at ON audit_log (at DESC);
