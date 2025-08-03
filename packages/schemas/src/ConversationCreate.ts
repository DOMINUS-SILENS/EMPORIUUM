import { z } from "zod";

// Schéma pour la création d'une conversation
export const conversationCreateSchema = z.object({
  participant_id: z.number().int(),
});

// Inferred type
export type ConversationCreate = z.infer<typeof conversationCreateSchema>;
