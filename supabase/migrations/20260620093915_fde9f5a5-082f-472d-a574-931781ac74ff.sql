
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.bump_article_likes() SET search_path = public;
ALTER FUNCTION public.bump_article_bookmarks() SET search_path = public;
ALTER FUNCTION public.bump_article_comments() SET search_path = public;
ALTER FUNCTION public.bump_comment_likes() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "articles_insert_auth" ON public.articles;
CREATE POLICY "articles_insert_own" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
