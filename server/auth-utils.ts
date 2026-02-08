import crypto from 'crypto';

/**
 * Simple password hashing using PBKDF2 (built-in Node.js crypto)
 * For production, consider using bcrypt package
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, originalHash] = hash.split(':');
    if (!salt || !originalHash) return false;

    const newHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return newHash === originalHash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Check if user subscription is still valid
 */
export function isSubscriptionValid(expiryDate: Date): boolean {
  return new Date() <= expiryDate;
}

/**
 * Calculate expiry date from number of days
 */
export function calculateExpiryDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
