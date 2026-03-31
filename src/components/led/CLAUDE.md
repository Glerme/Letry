# components/led/font-bitmap.ts

5×7 pixel bitmap font for the LED renderer.

## Exports
- `CHAR_WIDTH = 5` — pixels per character column
- `CHAR_HEIGHT = 7` — pixels per character row
- `getCharBitmap(char)` — returns array of 7 numbers (one per row)

## Encoding
Each row is a 5-bit number (bit 4 = leftmost, bit 0 = rightmost pixel).
Example: 0b01110 = pixels at columns 1,2,3 are ON.

## Coverage
A-Z (case-insensitive), 0-9, space, and common punctuation: ! ? . , - : /
Unknown characters return a filled rectangle (fallback).
