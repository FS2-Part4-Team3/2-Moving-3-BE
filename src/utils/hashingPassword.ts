import crypto from 'crypto';

export default function hashingPassword(password: string, salt: string) {
  const iterations = 25000;
  const keyLength = 64;

  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256').toString('hex');

  return hash;
}
