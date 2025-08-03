import { z } from "zod";

// Schéma pour la mise à jour du mot de passe
export const passwordUpdateSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
});

// Inferred type
export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;
