let pendingScan: string | null = null;

export function setPendingScan(value: string) {
  pendingScan = value;
}

export function consumePendingScan(): string | null {
  const value = pendingScan;
  pendingScan = null;
  return value;
}
