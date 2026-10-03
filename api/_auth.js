const crypto = require('crypto');

const COOKIE_NAME = 'catgac_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

function getEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' && value.length ? value : null;
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(value) {
  const secret = getEnv('AUTH_SECRET');
  if (!secret) throw new Error('Thiếu biến môi trường AUTH_SECRET');
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function createSession(username) {
  const payload = `${username}|${Date.now() + SESSION_TTL_SECONDS * 1000}`;
  const encoded = base64url(payload);
  return `${encoded}.${sign(encoded)}`;
}

function parseCookies(header) {
  const cookies = {};
  String(header || '').split(';').forEach(part => {
    const i = part.indexOf('=');
    if (i < 0) return;
    const key = part.slice(0, i).trim();
    const value = part.slice(i + 1).trim();
    if (key) cookies[key] = value;
  });
  return cookies;
}

function verifySession(req) {
  const cookies = parseCookies(req.headers && req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  const dot = token.lastIndexOf('.');
  if (dot <= 0) return false;
  const encoded = token.slice(0, dot);
  const provided = token.slice(dot + 1);
  const expected = sign(encoded);

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  let payload;
  try {
    payload = Buffer.from(encoded, 'base64url').toString('utf8');
  } catch (_) {
    return false;
  }
  const separator = payload.lastIndexOf('|');
  if (separator <= 0) return false;
  const username = payload.slice(0, separator);
  const expiresAt = Number(payload.slice(separator + 1));
  if (!username || !Number.isFinite(expiresAt) || Date.now() >= expiresAt) return false;

  return true;
}

function setSessionCookie(res, username) {
  const token = createSession(username);
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${SESSION_TTL_SECONDS}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
}

function requireAuth(req, res) {
  if (!verifySession(req)) {
    res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' });
    return false;
  }
  return true;
}

function credentialsValid(username, password) {
  const expectedUser = getEnv('APP_LOGIN_USER');
  const expectedPassword = getEnv('APP_LOGIN_PASSWORD');
  if (!expectedUser || !expectedPassword) throw new Error('Thiếu APP_LOGIN_USER hoặc APP_LOGIN_PASSWORD');
  return username === expectedUser && password === expectedPassword;
}

module.exports = {
  clearSessionCookie,
  credentialsValid,
  requireAuth,
  setSessionCookie,
  COOKIE_NAME
};
