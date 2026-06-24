-- Preserve the archive permanently: no article should be deleted by app code or future jobs.
CREATE OR REPLACE FUNCTION public.prevent_article_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Articles are append-only and cannot be deleted';
END;
$$;

DROP TRIGGER IF EXISTS prevent_article_delete_trigger ON public.articles;
CREATE TRIGGER prevent_article_delete_trigger
BEFORE DELETE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.prevent_article_delete();

CREATE OR REPLACE FUNCTION public.prevent_duplicate_article_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  source_url text;
BEGIN
  source_url := lower(nullif(NEW.sources->0->>'url', ''));

  IF EXISTS (
    SELECT 1 FROM public.articles a
    WHERE lower(regexp_replace(a.title, '\s+', ' ', 'g')) = lower(regexp_replace(NEW.title, '\s+', ' ', 'g'))
       OR (source_url IS NOT NULL AND lower(a.sources->0->>'url') = source_url)
       OR (NEW.cover_image_url IS NOT NULL AND a.cover_image_url = NEW.cover_image_url)
    LIMIT 1
  ) THEN
    RAISE EXCEPTION 'Duplicate article, source URL, or image rejected';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_duplicate_article_insert_trigger ON public.articles;
CREATE TRIGGER prevent_duplicate_article_insert_trigger
BEFORE INSERT ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_article_insert();
