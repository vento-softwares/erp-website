import { describe, expect, it } from 'vitest';
import { adminFiltersSchema, escapeLike, waitlistSignupSchema } from './validation';

describe('waitlistSignupSchema', () => {
  it('trims and lowercases the email, trims the name', () => {
    const r = waitlistSignupSchema.parse({ fullName: '  Ada Lovelace ', email: '  Ada@Example.COM ' });
    expect(r).toEqual({ fullName: 'Ada Lovelace', email: 'ada@example.com' });
  });

  it('strips angle brackets from names', () => {
    expect(waitlistSignupSchema.parse({ fullName: '<b>Ada</b>', email: 'a@b.co' }).fullName).toBe('bAda/b');
  });

  it.each([
    [{ fullName: 'A', email: 'a@b.co' }, 'Please enter your full name.'],
    [{ fullName: '<>', email: 'a@b.co' }, 'Please enter your full name.'],
    [{ fullName: 'x'.repeat(121), email: 'a@b.co' }, 'Full name is too long.'],
    [{ fullName: 'Ada', email: 'not-an-email' }, 'Please enter a valid email address.'],
    [{ fullName: 'Ada', email: `${'a'.repeat(250)}@b.co` }, 'Please enter a valid email address.'],
    [{ email: 'a@b.co' }, 'Full name is required.'],
  ])('rejects %j', (input, message) => {
    const r = waitlistSignupSchema.safeParse(input);
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toBe(message);
  });
});

describe('adminFiltersSchema', () => {
  it('falls back to safe defaults for junk input', () => {
    expect(adminFiltersSchema.parse({ search: '  ', status: 'nope', page: 'abc' })).toEqual({
      search: undefined,
      status: undefined,
      page: 1,
    });
  });

  it('accepts valid filters', () => {
    expect(adminFiltersSchema.parse({ search: ' ada ', status: 'invited', page: '3' })).toEqual({
      search: 'ada',
      status: 'invited',
      page: 3,
    });
  });
});

describe('escapeLike', () => {
  it('escapes LIKE wildcards and backslashes', () => {
    expect(escapeLike('50%_off\\')).toBe('50\\%\\_off\\\\');
  });
});
