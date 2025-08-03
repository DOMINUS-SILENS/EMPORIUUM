import { z } from "zod";

// Schéma de base pour un utilisateur
export const userBaseSchema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  role: z.any().default("acheteur"),
});

// Inferred type
export type UserBase = z.infer<typeof userBaseSchema>;
