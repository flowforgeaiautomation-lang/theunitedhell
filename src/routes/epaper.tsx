import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/epaper")({
  beforeLoad: () => {
    throw redirect({ to: "/editions/epaper" });
  },
  component: () => null,
});
