/*
# Permanent Comment Protection — No Hard Deletes Ever

## Problem
The old delete_comment_by_id did DELETE FROM comments (hard delete), which
permanently destroyed comment data. The trigger trg_article_comments only
fires on INSERT/DELETE, so soft-delete (UPDATE is_hidden=true) doesn't update
the article's comment_count.

## Fix
1. REVOKE DELETE permission on comments table from anon and authenticated roles
   so no client can ever hard-delete a comment, even if RLS somehow allows it.
2. Update the trigger to also fire on UPDATE (for soft-delete is_hidden changes).
3. Update bump_article_comments to handle UPDATE case.
4. Drop and recreate the trigger.
*/

-- 1. REVOKE hard DELETE permission from all client roles
REVOKE DELETE ON comments FROM anon, authenticated;

-- 2. Drop old trigger
DROP TRIGGER IF EXISTS trg_article_comments ON comments;

-- 3. Update the trigger function to handle INSERT, UPDATE (soft-delete), DELETE
DROP FUNCTION IF EXISTS bump_article_comments();
CREATE OR REPLACE FUNCTION bump_article_comments()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.articles SET comment_count = comment_count + 1 WHERE id = NEW.article_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.articles SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.article_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- If is_hidden changed from false to true (soft-delete), decrement count
    IF OLD.is_hidden = false AND NEW.is_hidden = true THEN
      UPDATE public.articles SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = NEW.article_id;
    ELSIF OLD.is_hidden = true AND NEW.is_hidden = false THEN
      -- If is_hidden changed from true to false (un-hide), increment count
      UPDATE public.articles SET comment_count = comment_count + 1 WHERE id = NEW.article_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

-- 4. Recreate trigger for INSERT, UPDATE, DELETE
CREATE TRIGGER trg_article_comments
  AFTER INSERT OR UPDATE OF is_hidden OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION bump_article_comments();

-- 5. Also revoke DELETE on comment_likes from client roles (likes should toggle via RPC only)
REVOKE DELETE ON comment_likes FROM anon, authenticated;
