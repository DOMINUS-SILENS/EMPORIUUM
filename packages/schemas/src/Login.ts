import { z } from "zod";

// Schéma pour la connexion d'un utilisateur
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Inferred type
export type Login = z.infer<typeof loginSchema>;
