import { z } from "zod";

// Schéma pour la création d'un message
export const messageCreateSchema = z.object({
  content: z.string(),
  conversation_id: z.number().int(),
});

// Inferred type
export type MessageCreate = z.infer<typeof messageCreateSchema>;
