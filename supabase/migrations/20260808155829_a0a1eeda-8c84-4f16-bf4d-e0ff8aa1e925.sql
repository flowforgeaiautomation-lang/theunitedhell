CREATE TABLE IF NOT EXISTS public.subscription_plans (
  code text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'inr',
  "interval" text NOT NULL DEFAULT 'month',
  stripe_price_id text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscription_plans TO anon, authenticated;
GRANT ALL ON public.subscription_plans TO service_role;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "plans readable" ON public.subscription_plans;
CREATE POLICY "plans readable" ON public.subscription_plans FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code text NOT NULL,
  status text NOT NULL DEFAULT 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_subscriptions_user_idx ON public.user_subscriptions(user_id);
GRANT SELECT ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.user_subscriptions TO service_role;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own subscription" ON public.user_subscriptions;
CREATE POLICY "own subscription" ON public.user_subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percent',
  discount_value integer NOT NULL DEFAULT 0,
  max_uses integer,
  max_uses_per_user integer NOT NULL DEFAULT 1,
  used_count integer NOT NULL DEFAULT 0,
  valid_until timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  auto_apply boolean NOT NULL DEFAULT false,
  eligible_only_new_users boolean NOT NULL DEFAULT false,
  stripe_coupon_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "active coupons readable" ON public.coupons;
CREATE POLICY "active coupons readable" ON public.coupons FOR SELECT TO authenticated USING (is_active);

CREATE TABLE IF NOT EXISTS public.user_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id uuid REFERENCES public.coupons(id) ON DELETE SET NULL,
  code text NOT NULL,
  status text NOT NULL DEFAULT 'available',
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_coupons_user_idx ON public.user_coupons(user_id);
GRANT SELECT ON public.user_coupons TO authenticated;
GRANT ALL ON public.user_coupons TO service_role;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own coupons" ON public.user_coupons;
CREATE POLICY "own coupons" ON public.user_coupons FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_checkout_session_id text,
  amount_cents integer NOT NULL DEFAULT 0,
  discount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'inr',
  plan_code text,
  coupon_code text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS transactions_user_idx ON public.transactions(user_id);
GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own transactions" ON public.transactions;
CREATE POLICY "own transactions" ON public.transactions FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number text,
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'inr',
  plan_code text,
  period_start timestamptz,
  period_end timestamptz,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS invoices_user_idx ON public.invoices(user_id);
GRANT SELECT ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own invoices" ON public.invoices;
CREATE POLICY "own invoices" ON public.invoices FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ── Routines ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_vocab_search(w text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.vocabulary_cache
     SET search_count = search_count + 1, last_searched_at = now()
   WHERE word = lower(w);
$$;
GRANT EXECUTE ON FUNCTION public.increment_vocab_search(text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.insert_comment(p_article_id uuid, p_body text, p_prompt_type text, p_parent_id uuid, p_user_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid;
BEGIN
  INSERT INTO public.comments (article_id, user_id, parent_id, prompt_type, body)
  VALUES (p_article_id, p_user_id, p_parent_id, coalesce(p_prompt_type, 'perspective'), p_body)
  RETURNING id INTO new_id;
  RETURN new_id;
END; $$;
GRANT EXECUTE ON FUNCTION public.insert_comment(uuid, text, text, uuid, uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.edit_comment_by_id(p_comment_id uuid, p_body text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.comments SET body = p_body, is_edited = true, updated_at = now() WHERE id = p_comment_id;
$$;
GRANT EXECUTE ON FUNCTION public.edit_comment_by_id(uuid, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.delete_comment_by_id(p_comment_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.comments WHERE id = p_comment_id;
$$;
GRANT EXECUTE ON FUNCTION public.delete_comment_by_id(uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.toggle_comment_like(p_comment_id uuid, p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing int; new_count int; is_liked boolean;
BEGIN
  IF p_user_id IS NULL THEN
    UPDATE public.comments SET like_count = like_count + 1 WHERE id = p_comment_id RETURNING like_count INTO new_count;
    RETURN jsonb_build_object('like_count', coalesce(new_count, 0), 'liked', true);
  END IF;
  SELECT count(*) INTO existing FROM public.comment_likes WHERE comment_id = p_comment_id AND user_id = p_user_id;
  IF existing > 0 THEN
    DELETE FROM public.comment_likes WHERE comment_id = p_comment_id AND user_id = p_user_id;
    is_liked := false;
  ELSE
    INSERT INTO public.comment_likes (comment_id, user_id) VALUES (p_comment_id, p_user_id) ON CONFLICT DO NOTHING;
    is_liked := true;
  END IF;
  SELECT count(*) INTO new_count FROM public.comment_likes WHERE comment_id = p_comment_id;
  UPDATE public.comments SET like_count = new_count WHERE id = p_comment_id;
  RETURN jsonb_build_object('like_count', coalesce(new_count, 0), 'liked', is_liked);
END; $$;
GRANT EXECUTE ON FUNCTION public.toggle_comment_like(uuid, uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_comment_likes_for_user(p_article_id uuid, p_user_id uuid)
RETURNS text[] LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(array_agg(cl.comment_id::text), ARRAY[]::text[])
    FROM public.comment_likes cl
    JOIN public.comments c ON c.id = cl.comment_id
   WHERE c.article_id = p_article_id AND cl.user_id = p_user_id;
$$;
GRANT EXECUTE ON FUNCTION public.get_comment_likes_for_user(uuid, uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.list_comments_by_article(p_article_id uuid, p_sort text)
RETURNS TABLE (
  id uuid, article_id uuid, user_id uuid, parent_id uuid, prompt_type text, body text,
  like_count integer, reply_count bigint, is_edited boolean, status text,
  created_at timestamptz, updated_at timestamptz,
  username text, display_name text, avatar_url text
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.article_id, c.user_id, c.parent_id, c.prompt_type, c.body,
         c.like_count,
         (SELECT count(*) FROM public.comments r WHERE r.parent_id = c.id) AS reply_count,
         c.is_edited, c.status, c.created_at, c.updated_at,
         p.username, p.display_name, p.avatar_url
    FROM public.comments c
    LEFT JOIN public.profiles p ON p.id = c.user_id
   WHERE c.article_id = p_article_id AND c.is_hidden = false
   ORDER BY
     CASE WHEN p_sort = 'top' THEN c.like_count END DESC NULLS LAST,
     CASE WHEN p_sort = 'oldest' THEN c.created_at END ASC,
     c.created_at DESC;
$$;
GRANT EXECUTE ON FUNCTION public.list_comments_by_article(uuid, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.update_trending_scores()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.articles
     SET trending_score = (view_count * 1.0 + like_count * 4.0 + comment_count * 6.0 + bookmark_count * 3.0)
         / (1 + EXTRACT(EPOCH FROM (now() - coalesce(published_at, created_at))) / 43200.0)
   WHERE is_published = true;
$$;
GRANT EXECUTE ON FUNCTION public.update_trending_scores() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_articles_missing_video(p_limit integer)
RETURNS TABLE (id uuid, title text, category text, cover_image_url text, cover_video_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT a.id, a.title, a.category, a.cover_image_url, a.cover_video_url
    FROM public.articles a
   WHERE a.cover_video_url IS NULL
   ORDER BY a.published_at DESC NULLS LAST
   LIMIT greatest(coalesce(p_limit, 10), 1);
$$;
GRANT EXECUTE ON FUNCTION public.get_articles_missing_video(integer) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.count_articles_missing_video()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::int FROM public.articles WHERE cover_video_url IS NULL;
$$;
GRANT EXECUTE ON FUNCTION public.count_articles_missing_video() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.update_cover_video_url(p_article_id uuid, p_video_url text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.articles SET cover_video_url = p_video_url, updated_at = now() WHERE id = p_article_id;
$$;
GRANT EXECUTE ON FUNCTION public.update_cover_video_url(uuid, text) TO anon, authenticated, service_role;