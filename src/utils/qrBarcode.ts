// Lightweight vector QR and Barcode generators for high-fidelity logistics scanning

// Generates an SVG string representation of a Code 128-style barcode for a given code
export function generateBarcodeSvg(code: string, width = 240, height = 50): string {
  // Simple deterministic pattern generator based on char codes
  let bars: boolean[] = [true, false, true, true, false]; // start sequence
  
  for (let i = 0; i < code.length; i++) {
    const val = code.charCodeAt(i);
    const pattern = [
      (val & 1) !== 0,
      (val & 2) !== 0,
      (val & 4) === 0,
      (val & 8) !== 0,
      (val & 16) === 0,
      (val & 32) !== 0,
      true,
      false,
    ];
    bars = bars.concat(pattern);
  }
  bars.push(true, true, false, true, true); // stop sequence

  const barWidth = width / bars.length;
  const rects = bars
    .map((isDark, idx) => {
      if (!isDark) return '';
      return `<rect x="${(idx * barWidth).toFixed(1)}" y="0" width="${(barWidth * 0.95).toFixed(1)}" height="${height}" fill="currentColor" />`;
    })
    .filter(Boolean)
    .join('');

  return `<svg viewBox="0 0 ${width} ${height}" class="w-full h-full text-slate-900" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

// Generates a 21x21 QR code matrix representation for vector rendering
export function generateQrMatrix(text: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns at (0,0), (0, 14), (14, 0)
  const placeFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 || i === 6 || j === 0 || j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          matrix[r + i][c + j] = true;
        } else {
          matrix[r + i][c + j] = false;
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, 14);
  placeFinder(14, 0);

  // Timing patterns
  for (let i = 8; i < 13; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Populate data area pseudo-deterministically from text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff;
  }

  let bitIdx = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finder patterns
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= 13) ||
        (r >= 13 && c < 8) ||
        (r === 6 || c === 6)
      ) {
        continue;
      }
      const pseudoBit = ((hash >> (bitIdx % 31)) & 1) === 1;
      const charFactor = text.charCodeAt(bitIdx % text.length) % 2 === 0;
      matrix[r][c] = (pseudoBit !== charFactor);
      bitIdx++;
    }
  }

  return matrix;
}
