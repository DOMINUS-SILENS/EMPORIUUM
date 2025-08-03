import { z } from "zod";
import { userSchema } from "./User";

// Schéma pour un message
export const messageSchema = z.object({
  id: z.number().int(),
  content: z.string(),
  sender_id: z.number().int(),
  created_at: z.string().datetime({ offset: true }),
  is_read: z.boolean(),
  sender: userSchema,
});

// Inferred type
export type Message = z.infer<typeof messageSchema>;
