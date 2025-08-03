import { z } from "zod";

// Schéma pour les données du token JWT
export const tokenDataSchema = z.object({
  email: z.string().optional(),
  scopes: z.array(z.string()).default([]),
});

// Inferred type
export type TokenData = z.infer<typeof tokenDataSchema>;
