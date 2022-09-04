export function range(size: number, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

export function characterRange(startChar: string, endChar: string) {
  return String.fromCharCode(
    ...range(
      endChar.charCodeAt(0) - startChar.charCodeAt(0),
      startChar.charCodeAt(0),
    ),
  );
}
