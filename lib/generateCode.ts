const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCoupleCode(): string {
  let code = '';
  const cryptoObj = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (cryptoObj?.getRandomValues) {
    const buf = new Uint8Array(6);
    cryptoObj.getRandomValues(buf);
    for (let i = 0; i < 6; i++) {
      code += CHARS[buf[i]! % CHARS.length];
    }
    return code;
  }
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}
