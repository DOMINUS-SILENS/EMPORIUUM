import { z } from "zod";

// Schéma pour la création d'un utilisateur
export const userCreateSchema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  role: z.any().default("acheteur"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

// Inferred type
export type UserCreate = z.infer<typeof userCreateSchema>;
