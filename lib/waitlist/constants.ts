// Plain constants with no server/DB imports, so client components can use them.
export const WAITLIST_STATUSES = ['waiting', 'invited', 'joined'] as const;
export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];
