/*
# Remove DELETE RLS policy on comments — hard delete is now impossible

Since we REVOKE'd DELETE at the table level, the DELETE RLS policy is dead code.
Remove it for clarity. The soft-delete RPC uses UPDATE (SECURITY DEFINER) which
bypasses RLS entirely.
*/
DROP POLICY IF EXISTS "comments_delete_own" ON comments;
DROP POLICY IF EXISTS "comment_likes_delete_own" ON comment_likes;
