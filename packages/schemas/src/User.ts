import { z } from "zod";

// Schéma pour la réponse API (sans les données sensibles)
export const userSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  full_name: z.string().optional(),
  role: z.any().default("acheteur"),
  is_active: z.boolean(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }).optional(),
});

// Inferred type
export type User = z.infer<typeof userSchema>;
