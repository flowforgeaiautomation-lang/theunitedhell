import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { runIngestion } = await import("@/lib/ingestion.server");
        try {
          let body: { maxItems?: number; category?: string } = {};
          try {
            body = await request.json();
          } catch {
            body = {};
          }
          const r = await runIngestion({
            maxItems: Math.min(Math.max(Number(body.maxItems ?? 80), 1), 120),
            priorityCategory: typeof body.category === "string" ? body.category : undefined,
            mode: "cron",
          });
          return Response.json({ ok: true, ...r, at: new Date().toISOString() });
        } catch (e) {
          return Response.json(
            { ok: false, error: (e as Error).message },
            { status: 500 },
          );
        }
      },
      GET: async () => {
        return Response.json({ ok: true, hint: "POST to trigger ingestion" });
      },
    },
  },
});
