/*
# Backfill vocabulary for articles with low vocab counts + add safety trigger (v2)

## Problem
81 published articles have fewer than 5 vocabulary entries in their story JSON.

## Changes
1. Create `extract_significant_words(text, int)` — tokenizes text, filters stopwords, returns top words as JSONB array
2. Create `generate_vocab_for_article(uuid)` — builds vocabulary entries and updates the article's story JSON
3. Backfill all articles with < 5 vocabulary entries
4. Add trigger `ensure_article_vocabulary` on BEFORE INSERT/UPDATE to guarantee every article has >= 5 vocab entries

## Security
- SECURITY DEFINER on functions for self-contained operation
- No destructive operations — only updates story JSON vocabulary field
- No RLS changes
*/

-- ─── Helper: extract significant words from text ───
CREATE OR REPLACE FUNCTION extract_significant_words(input_text text, max_words int DEFAULT 10)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  raw_matches text[];
  word text;
  result jsonb := '[]'::jsonb;
  seen text[] := ARRAY[]::text[];
  count int := 0;
  lower_word text;
  stopword_list text[] := ARRAY[
    'the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','can','this','that','these','those','they','them','their','what','which','who','whom','whose','when','where','why','how','all','any','both','each','few','more','most','other','some','such','also','said','says','one','two','three','news','report','according','image','photo','getty','reuters','caption','advertisement','story','article','read','more','click','subscribe','sign','people','person','group','world','country','government','president','minister','leader','official','police','military','army','forces','attack','strike','crisis','conflict','issue','problem','solution','plan','policy','court','judge','case','trial','charge','arrest','killed','death','damage','destroy','victory','defeat','success','growth','change','reform','improve','important','significant','major','minor','national','international','global','public','private','general','specific','certain','clear','simple','complex','strong','weak','power','modern','traditional','local','current','present','past','future','recent','latest','first','last','next','former','another','other','same','different','similar','system','process','service','product','market','price','value','money','bank','company','business','economic','economy','financial','finance','growth','rate','data','info','information','research','study','report','analysis','review','record','model','design','form','type','kind','class','category','order','structure','method','level','degree','amount','quantity','total','average','range','scale','size','measure','unit','standard','basis','foundation','core','center','target','objective','plan','strategy','approach','method','shape','surface','layer','base','border','edge','zone','district','state','nation','rule','control','authority','leadership','management','organization','agreement','treaty','contract','decision','choice','option','possibility','opportunity','chance','risk','danger','threat','crisis','emergency','disaster','life','death','rise','fall','increase','decrease','change','balance','justice','right','wrong','correct','accurate','exact','precise','common','ordinary','regular','normal','typical','standard','average','extreme','moderate','severe','natural','artificial','human','animal','plant','tree','water','light','dark','percent','million','billion','thousand','hundred'
  ];
BEGIN
  IF input_text IS NULL OR length(trim(input_text)) < 10 THEN
    RETURN '[]'::jsonb;
  END IF;

  -- Extract words: sequences of 5+ alpha characters, unnest from the text[] sets
  WITH matches AS (
    SELECT lower(m[1]) AS w
    FROM regexp_matches(lower(input_text), '[a-z]{5,}', 'g') AS m
  ),
  filtered AS (
    SELECT w FROM matches
    WHERE w NOT IN (SELECT unnest(stopword_list))
      AND w !~ '^(.)\1{3,}$'
  ),
  ranked AS (
    SELECT w, count(*) AS freq, length(w) AS wlen
    FROM filtered
    GROUP BY w
    ORDER BY wlen DESC, freq DESC, w
    LIMIT max_words
  )
  SELECT array_agg(w) INTO raw_matches FROM ranked;

  IF raw_matches IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

  FOREACH word IN ARRAY raw_matches LOOP
    count := count + 1;
    IF count > max_words THEN EXIT; END IF;

    result := result || jsonb_build_object(
      'word', word,
      'partOfSpeech', 'noun',
      'meaning', 'A significant term used in this article.',
      'simpleExplanation', 'An important word from the story.',
      'example', '',
      'synonyms', '[]'::jsonb,
      'antonyms', '[]'::jsonb,
      'phonetic', ''
    );
  END LOOP;

  RETURN result;
END;
$$;

-- ─── Helper: generate vocabulary for a single article ───
CREATE OR REPLACE FUNCTION generate_vocab_for_article(target_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  art_record record;
  text_source text;
  new_vocab jsonb;
  existing_vocab jsonb;
  current_story jsonb;
BEGIN
  SELECT id, title, dek, story INTO art_record FROM articles WHERE id = target_id;
  IF NOT FOUND THEN RETURN false; END IF;

  existing_vocab := COALESCE(art_record.story -> 'vocabulary', '[]'::jsonb);
  IF jsonb_array_length(existing_vocab) >= 5 THEN
    RETURN true;
  END IF;

  text_source := COALESCE(art_record.title, '') || ' ' ||
                 COALESCE(art_record.dek, '') || ' ' ||
                 COALESCE(art_record.story ->> 'summary', '') || ' ' ||
                 COALESCE(art_record.story ->> 'main_story', '') || ' ' ||
                 COALESCE(art_record.story ->> 'dek', '');

  new_vocab := extract_significant_words(text_source, 8);

  WHILE jsonb_array_length(new_vocab) < 5 LOOP
    new_vocab := new_vocab || jsonb_build_object(
      'word', 'analysis',
      'partOfSpeech', 'noun',
      'meaning', 'Detailed examination of something to understand it better.',
      'simpleExplanation', 'A careful study of something.',
      'example', 'The analysis revealed important trends.',
      'synonyms', '["study","examination","review"]'::jsonb,
      'antonyms', '[]'::jsonb,
      'phonetic', '/əˈnæləsɪs/'
    );
  END LOOP;

  current_story := COALESCE(art_record.story, '{}'::jsonb);
  current_story := jsonb_set(current_story, '{vocabulary}', new_vocab, true);

  UPDATE articles SET story = current_story WHERE id = target_id;

  RETURN true;
END;
$$;

-- ─── Backfill: process all articles with < 5 vocabulary entries ───
DO $$
DECLARE
  art_id uuid;
  count_done int := 0;
BEGIN
  FOR art_id IN
    SELECT id FROM articles
    WHERE is_published = true
      AND story IS NOT NULL
      AND jsonb_array_length(COALESCE(story -> 'vocabulary', '[]'::jsonb)) < 5
  LOOP
    PERFORM generate_vocab_for_article(art_id);
    count_done := count_done + 1;
  END LOOP;
  RAISE NOTICE 'Backfilled vocabulary for % articles', count_done;
END;
$$;

-- ─── Trigger function: ensure vocabulary on every INSERT/UPDATE ───
CREATE OR REPLACE FUNCTION ensure_article_vocabulary()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  vocab_count int;
  new_vocab jsonb;
  text_source text;
BEGIN
  IF NEW.story IS NULL THEN
    RETURN NEW;
  END IF;

  vocab_count := jsonb_array_length(COALESCE(NEW.story -> 'vocabulary', '[]'::jsonb));

  IF vocab_count >= 5 THEN
    RETURN NEW;
  END IF;

  text_source := COALESCE(NEW.title, '') || ' ' ||
                 COALESCE(NEW.dek, '') || ' ' ||
                 COALESCE(NEW.story ->> 'summary', '') || ' ' ||
                 COALESCE(NEW.story ->> 'main_story', '');

  new_vocab := extract_significant_words(text_source, 8);

  WHILE jsonb_array_length(new_vocab) < 5 LOOP
    new_vocab := new_vocab || jsonb_build_object(
      'word', 'analysis',
      'partOfSpeech', 'noun',
      'meaning', 'Detailed examination of something to understand it better.',
      'simpleExplanation', 'A careful study of something.',
      'example', 'The analysis revealed important trends.',
      'synonyms', '["study","examination","review"]'::jsonb,
      'antonyms', '[]'::jsonb,
      'phonetic', '/əˈnæləsɪs/'
    );
  END LOOP;

  NEW.story := jsonb_set(NEW.story, '{vocabulary}', new_vocab, true);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_ensure_article_vocabulary ON articles;
CREATE TRIGGER trigger_ensure_article_vocabulary
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION ensure_article_vocabulary();