// Neutral Application Error Reporting Utility
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[App Error Handler]:", error, context);
}
