// UUID v7: 48-bit ms timestamp + random. Sortable by creation time,
// safe for local-first data that may later sync across devices.
export function uuid(): string {
  const ts = Date.now();
  const tsHex = ts.toString(16).padStart(12, '0');

  const rnd = new Uint8Array(10);
  crypto.getRandomValues(rnd);

  // version 7
  rnd[0] = (rnd[0] & 0x0f) | 0x70;
  // variant RFC 4122
  rnd[2] = (rnd[2] & 0x3f) | 0x80;

  const hex = Array.from(rnd, (b) => b.toString(16).padStart(2, '0')).join('');

  return (
    tsHex.slice(0, 8) + '-' +
    tsHex.slice(8, 12) + '-' +
    hex.slice(0, 4) + '-' +
    hex.slice(4, 8) + '-' +
    hex.slice(8, 20)
  );
}
