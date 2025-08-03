import { z } from "zod";

// Schéma pour la mise à jour d'un utilisateur
export const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  full_name: z.string().optional(),
  password: z.string().min(8).optional(),
  is_active: z.boolean().optional(),
});

// Inferred type
export type UserUpdate = z.infer<typeof userUpdateSchema>;
