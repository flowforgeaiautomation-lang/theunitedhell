REVOKE EXECUTE ON FUNCTION public.insert_comment(uuid, text, text, uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.toggle_comment_like(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.edit_comment_by_id(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.delete_comment_by_id(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_comment_likes_for_user(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_trending_scores() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_articles_missing_video(integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.count_articles_missing_video() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_cover_video_url(uuid, text) FROM anon, authenticated;