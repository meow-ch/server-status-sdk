export function pad(subject: string|number, chars: string, finalLenWithPadding: number, position: 'start' | 'end' = 'start') {
  // hel, abc, 10 -> abcabcahel
  // hel, abc, 5 -> abhel
  // hel, abc, 2 -> hel

  const str = `${subject}`;

  // 10 - 3 = 7
  // 5 - 3 = 2
  // 2 - 3 = -1
  const missingCount = finalLenWithPadding - str.length;

  // false
  // false
  // true
  if (missingCount <= 0) return str;

  // 7 / 3 = 2
  // 2 / 3 = 0
  const times = Math.floor(missingCount / chars.length);
  // 7 % 3 = 1
  // 2 % 3 = 2
  const diff = missingCount % chars.length;
  // "abcabc" + "a"
  // "" + "ab"
  const padAdd = chars.repeat(times) + chars.slice(0, diff);

  // "abcabc" + "a" + "hel" = abcabcahel
  // "" + "ab" + "hel" = abhel
  return position === 'start' ? padAdd + str : str + padAdd;
}

export function zeroPadded(num: number, len: number = 2): string {
  return pad(num, "0", len, "start");
}

export default pad;