import { describe, expect, it } from 'vitest';
import { canonicalEmail } from './canonical-email';

describe('canonicalEmail', () => {
  it.each([
    ['  Ada@Example.COM ', 'ada@example.com'],
    ['ada+promo@example.com', 'ada@example.com'],
    ['ada+a+b@example.com', 'ada@example.com'],
    ['a.d.a@gmail.com', 'ada@gmail.com'],
    ['A.Da+test@GoogleMail.com', 'ada@gmail.com'],
    ['first.last@company.com', 'first.last@company.com'], // dots only matter for Gmail
    ['+tag@example.com', '+tag@example.com'], // nothing before "+": leave as-is
  ])('%s -> %s', (input, expected) => {
    expect(canonicalEmail(input)).toBe(expected);
  });
});
