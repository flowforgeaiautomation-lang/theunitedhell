ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS cover_video_url text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS trending_score numeric NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS is_edited boolean NOT NULL DEFAULT false;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.reading_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prefs jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_preferences TO authenticated;
GRANT ALL ON public.reading_preferences TO service_role;
ALTER TABLE public.reading_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own reading prefs" ON public.reading_preferences;
CREATE POLICY "own reading prefs" ON public.reading_preferences FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.reading_progress (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug text NOT NULL,
  scroll_percent integer NOT NULL DEFAULT 0,
  read_seconds integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, article_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_progress TO authenticated;
GRANT ALL ON public.reading_progress TO service_role;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own reading progress" ON public.reading_progress;
CREATE POLICY "own reading progress" ON public.reading_progress FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.reading_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug text NOT NULL,
  selected_text text NOT NULL,
  note text,
  color text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_notes TO authenticated;
GRANT ALL ON public.reading_notes TO service_role;
ALTER TABLE public.reading_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own reading notes" ON public.reading_notes;
CREATE POLICY "own reading notes" ON public.reading_notes FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.saved_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word text NOT NULL,
  meaning text,
  pronunciation text,
  part_of_speech text,
  example text,
  synonyms text[],
  antonyms text[],
  simple_explanation text,
  context_in_article text,
  word_origin text,
  article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  difficulty text NOT NULL DEFAULT 'intermediate',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, word)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_words TO authenticated;
GRANT ALL ON public.saved_words TO service_role;
ALTER TABLE public.saved_words ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own saved words" ON public.saved_words;
CREATE POLICY "own saved words" ON public.saved_words FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.article_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  question_type text NOT NULL,
  question text NOT NULL,
  options jsonb,
  correct_answer text,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS article_quizzes_article_idx ON public.article_quizzes(article_id);
GRANT SELECT ON public.article_quizzes TO anon, authenticated;
GRANT ALL ON public.article_quizzes TO service_role;
ALTER TABLE public.article_quizzes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "quizzes readable" ON public.article_quizzes;
CREATE POLICY "quizzes readable" ON public.article_quizzes FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.vocabulary_cache (
  word text PRIMARY KEY,
  part_of_speech text,
  meaning text,
  simple_explanation text,
  example text,
  synonyms text[],
  antonyms text[],
  pronunciation text,
  source text,
  search_count integer NOT NULL DEFAULT 0,
  last_searched_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vocabulary_cache TO anon, authenticated;
GRANT ALL ON public.vocabulary_cache TO service_role;
ALTER TABLE public.vocabulary_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "vocab readable" ON public.vocabulary_cache;
CREATE POLICY "vocab readable" ON public.vocabulary_cache FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.article_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug text NOT NULL,
  language text NOT NULL,
  translated_title text,
  translated_dek text,
  translated_body text,
  translated_story jsonb,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (article_slug, language)
);
GRANT SELECT ON public.article_translations TO anon, authenticated;
GRANT ALL ON public.article_translations TO service_role;
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "translations readable" ON public.article_translations;
CREATE POLICY "translations readable" ON public.article_translations FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.translation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug text NOT NULL,
  language text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (article_slug, language)
);
GRANT SELECT ON public.translation_queue TO anon, authenticated;
GRANT ALL ON public.translation_queue TO service_role;
ALTER TABLE public.translation_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "queue readable" ON public.translation_queue;
CREATE POLICY "queue readable" ON public.translation_queue FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.market_prices (
  symbol text PRIMARY KEY,
  name text NOT NULL,
  category text,
  region text,
  price numeric,
  change numeric,
  change_percent numeric,
  available boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.market_prices TO anon, authenticated;
GRANT ALL ON public.market_prices TO service_role;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "markets readable" ON public.market_prices;
CREATE POLICY "markets readable" ON public.market_prices FOR SELECT TO anon, authenticated USING (true);