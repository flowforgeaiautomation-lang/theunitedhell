SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname IN ('the-united-hell-ingest-30m', 'the-united-hell-ingest-20m');

SELECT cron.schedule(
  'the-united-hell-ingest-20m',
  '*/20 * * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.site_url', true) || '/api/public/hooks/ingest',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"maxItems":80}'::jsonb
  ) AS request_id;
  $$
);
