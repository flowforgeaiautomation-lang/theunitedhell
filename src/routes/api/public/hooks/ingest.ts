import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/ingest")({
  server: {
    handlers: {
      POST: async () => {
        const { runIngestion } = await import("@/lib/ingestion.server");
        try {
          const r = await runIngestion({ maxItems: 120 });
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
