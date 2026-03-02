type QueryParams = Record<string, string | number | boolean | undefined | null>;

export function toSearchString(params?: QueryParams): string {
  if (!params) return "";

  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null,
  );

  if (!entries.length) return "";

  const searchParams = new URLSearchParams();

  for (const [key, value] of entries) {
    searchParams.append(key, String(value));
  }

  return `?${searchParams.toString()}`;
}
