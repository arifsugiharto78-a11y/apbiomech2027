export function withBase(path: string, base = import.meta.env.BASE_URL): string {
  const prefix = `/${base.split('/').filter(Boolean).join('/')}`;
  return `${prefix === '/' ? '' : prefix}/${path.replace(/^\/+/, '')}`;
}

export function safeExternal(value: string | null | undefined): string | null {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
  catch { return null; }
}
