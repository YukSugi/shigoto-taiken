export function isValidUuid(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

export function isValidOptionId(value: unknown): value is "A" | "B" | "C" | "D" {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

export function isValidScore(value: unknown): value is 0 | 5 | 10 {
  return value === 0 || value === 5 || value === 10;
}

export function isValidFeedbackType(
  value: unknown
): value is "good" | "normal" | "bad" {
  return value === "good" || value === "normal" || value === "bad";
}

export function sanitizePlayerName(name: unknown): string {
  if (typeof name !== "string" || name.trim() === "") return "プレイヤー";
  return name.trim().slice(0, 30);
}
