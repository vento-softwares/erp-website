import { describe, expect, it } from 'vitest';
import { csvField, parseCsv, toCsv } from './csv';

describe('csvField', () => {
  it('quotes and escapes', () => {
    expect(csvField('a "b", c')).toBe('"a ""b"", c"');
  });

  it.each(['=CMD()', '+1', '-1', '@SUM(A1)'])('neutralises formula prefix in %s', (v) => {
    expect(csvField(v)).toBe(`"'${v}"`);
  });

  it('handles null, booleans and dates', () => {
    expect(csvField(null)).toBe('""');
    expect(csvField(false)).toBe('"false"');
    expect(csvField(new Date('2026-01-02T03:04:05.000Z'))).toBe('"2026-01-02T03:04:05.000Z"');
  });
});

describe('parseCsv', () => {
  it('round-trips toCsv output', () => {
    const csv = toCsv(['a', 'b'], [['x, "y"', 'line1\nline2'], ['', 'z']]);
    expect(parseCsv(csv)).toEqual([
      ['a', 'b'],
      ['x, "y"', 'line1\nline2'],
      ['', 'z'],
    ]);
  });

  it('handles BOM, LF endings and a trailing newline', () => {
    expect(parseCsv('﻿a,b\n1,2\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });
});
