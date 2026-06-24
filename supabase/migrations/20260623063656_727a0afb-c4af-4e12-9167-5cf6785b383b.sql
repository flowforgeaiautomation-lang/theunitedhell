SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname IN ('the-united-hell-ingest-30m', 'the-united-hell-ingest-20m');

SELECT cron.schedule(
  'the-united-hell-ingest-20m',
  '*/20 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--dbf0d7a1-df0c-4496-876d-3be10cd5545a-dev.lovable.app/api/public/hooks/ingest',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuc29ya3Z6eXRxYmVvZmxwcGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDM2MzgsImV4cCI6MjA5NzUxOTYzOH0.gDEqh2rzzTyGvjPP_wk-H5AQ3MeNNy_vkFqnoK656Ls"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);