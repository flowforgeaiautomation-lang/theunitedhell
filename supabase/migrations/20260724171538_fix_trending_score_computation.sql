
-- Recompute trending_score for all articles based on engagement signals.
-- view_count: 1pt each | bookmark_count: 3pt each | comment_count: 2pt each
-- Recency decay: articles older than 7 days get a 0.5x multiplier, older than 30 days get 0.2x.

UPDATE articles
SET trending_score = ROUND(
  (
    COALESCE(view_count, 0) * 1 +
    COALESCE(bookmark_count, 0) * 3 +
    COALESCE(comment_count, 0) * 2
  ) * CASE
    WHEN created_at >= NOW() - INTERVAL '3 days'  THEN 1.0
    WHEN created_at >= NOW() - INTERVAL '7 days'  THEN 0.7
    WHEN created_at >= NOW() - INTERVAL '30 days' THEN 0.4
    ELSE 0.1
  END
);

-- Ensure articles with zero engagement but published today get a non-zero base score
-- so the trending feed is never empty.
UPDATE articles
SET trending_score = 1
WHERE trending_score = 0
  AND created_at >= NOW() - INTERVAL '7 days';

-- Create or replace function to keep trending_score live on every view/bookmark/comment bump.
CREATE OR REPLACE FUNCTION compute_trending_score(
  p_view_count INT,
  p_bookmark_count INT,
  p_comment_count INT,
  p_created_at TIMESTAMPTZ
) RETURNS NUMERIC AS $$
DECLARE
  raw NUMERIC;
  age_factor NUMERIC;
BEGIN
  raw := COALESCE(p_view_count, 0) * 1
       + COALESCE(p_bookmark_count, 0) * 3
       + COALESCE(p_comment_count, 0) * 2;
  age_factor := CASE
    WHEN p_created_at >= NOW() - INTERVAL '3 days'  THEN 1.0
    WHEN p_created_at >= NOW() - INTERVAL '7 days'  THEN 0.7
    WHEN p_created_at >= NOW() - INTERVAL '30 days' THEN 0.4
    ELSE 0.1
  END;
  RETURN GREATEST(ROUND(raw * age_factor), 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-update trending_score whenever engagement columns change.
CREATE OR REPLACE FUNCTION trg_refresh_trending_score() RETURNS trigger AS $$
BEGIN
  NEW.trending_score := compute_trending_score(
    NEW.view_count,
    NEW.bookmark_count,
    NEW.comment_count,
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS refresh_trending_score ON articles;
CREATE TRIGGER refresh_trending_score
BEFORE UPDATE OF view_count, bookmark_count, comment_count ON articles
FOR EACH ROW EXECUTE FUNCTION trg_refresh_trending_score();
