import { CookieOptions } from 'express';

export const generateCookieOptions = (
  expires: number,
  options?: CookieOptions
): CookieOptions => ({
  expires: new Date(Date.now() + expires * 60 * 1000),
  maxAge: expires * 60 * 1000,
  ...options,
});
