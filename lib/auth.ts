import { timingSafeEqual } from 'crypto';
export function isAdmin(password: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  if (typeof password !== 'string' || !expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
