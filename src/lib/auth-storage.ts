const ACCESS_TOKEN_COOKIE = 'accessToken-deadlink-watchdog';
const REFRESH_TOKEN_COOKIE = 'refreshToken-deadlink-watchdog';
const ACCESS_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

export function getAccessToken(): string | null {
  return readCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | null {
  return readCookie(REFRESH_TOKEN_COOKIE);
}

export function setAuthTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): void {
  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(tokens.accessToken)}; Path=/; Max-Age=${ACCESS_TOKEN_MAX_AGE}; SameSite=Strict${secure}`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(tokens.refreshToken)}; Path=/; Max-Age=${REFRESH_TOKEN_MAX_AGE}; SameSite=Strict${secure}`;
}

export function clearAuthTokens(): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Strict`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Strict`;
  window.dispatchEvent(new Event('deadlink:auth-logout'));
}
