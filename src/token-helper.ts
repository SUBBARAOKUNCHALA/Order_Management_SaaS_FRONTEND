// token-helper.ts
export function compactToken(obj: { iv: string; content: string; tag: string }): string {
  return `${obj.iv}.${obj.content}.${obj.tag}`;
}

export function expandToken(compact: string) {
  const parts = compact.split('.');
  if (parts.length !== 3) throw new Error('Invalid compact token');
  return { iv: parts[0], content: parts[1], tag: parts[2] };
}
