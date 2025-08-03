import { z } from "zod";
import { userSchema } from "./User";
import { messageSchema } from "./Message";

// Schéma pour une conversation
export const conversationSchema = z.object({
  id: z.number().int(),
  user1: userSchema,
  user2: userSchema,
  messages: z.array(messageSchema).default([]),
  created_at: z.string().datetime({ offset: true }),
});

// Inferred type
export type Conversation = z.infer<typeof conversationSchema>;
