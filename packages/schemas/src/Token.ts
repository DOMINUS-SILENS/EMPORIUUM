import { z } from "zod";

// Schéma pour le token JWT
export const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default("bearer"),
});

// Inferred type
export type Token = z.infer<typeof tokenSchema>;
