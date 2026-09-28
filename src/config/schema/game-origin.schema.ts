import { z } from 'zod';

/**
 * Sandbox tokens a third-party game origin may be granted. Tokens that would let a
 * frame navigate the FNX page or escape the sandbox (allow-top-navigation*,
 * allow-popups-to-escape-sandbox, allow-modals) are intentionally not accepted.
 */
export const IFRAME_SANDBOX_TOKENS = [
  'allow-scripts',
  'allow-same-origin',
  'allow-pointer-lock',
  'allow-forms',
  'allow-orientation-lock',
] as const;

export const thirdPartyGameOriginSchema = z
  .object({
    origin: z
      .url({ protocol: /^https$/ })
      .refine((value) => new URL(value).origin === value, 'must be a bare origin such as "https://games.partner.com"'),
    /** Why FNX trusts this origin. Required so the allowlist stays reviewable. */
    reason: z.string().min(1),
    sandbox: z.array(z.enum(IFRAME_SANDBOX_TOKENS)).min(1),
  })
  .strict();

export const thirdPartyGameOriginsSchema = z.array(thirdPartyGameOriginSchema);

export type ThirdPartyGameOrigin = z.output<typeof thirdPartyGameOriginSchema>;
export type IframeSandboxToken = (typeof IFRAME_SANDBOX_TOKENS)[number];
