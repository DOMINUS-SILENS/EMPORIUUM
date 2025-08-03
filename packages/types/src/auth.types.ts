// packages/types/src/auth.types.ts

import { z } from "zod";

/**
 * ✅ Zod Schema – Réponse du backend après login
 */
export const AuthResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().optional(), // Peut être utile pour rafraîchir le token
});

/**
 * ✅ Type TypeScript dérivé du schéma
 */
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
