export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  pick<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

export function generateSeed(): number {
  return Date.now() % 100000;
}

export function hashStringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 100000;
}

const REPLAY_CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const CODE_BASE = REPLAY_CODE_CHARS.length;

export function encodeReplayCode(seed: number): string {
  let num = Math.abs(seed) % 100000;
  let code = '';
  while (num > 0 || code.length < 4) {
    code = REPLAY_CODE_CHARS[num % CODE_BASE] + code;
    num = Math.floor(num / CODE_BASE);
  }
  return code;
}

export function decodeReplayCode(code: string): number | null {
  const cleanCode = code.toUpperCase().replace(/[^23456789ABCDEFGHJKLMNPQRSTUVWXYZ]/g, '');
  if (cleanCode.length === 0) return null;
  
  let seed = 0;
  for (let i = 0; i < cleanCode.length; i++) {
    const char = cleanCode[i];
    const index = REPLAY_CODE_CHARS.indexOf(char);
    if (index === -1) return null;
    seed = seed * CODE_BASE + index;
  }
  return seed % 100000;
}
