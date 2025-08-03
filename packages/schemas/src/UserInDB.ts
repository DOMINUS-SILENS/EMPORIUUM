import { z } from "zod";

// Schéma pour l'utilisateur dans la base de données (avec mot de passe hashé)
export const userInDBSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  full_name: z.string().optional(),
  role: z.any().default("acheteur"),
  is_active: z.boolean(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }).optional(),
  hashed_password: z.string(),
});

// Inferred type
export type UserInDB = z.infer<typeof userInDBSchema>;
