import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  full_name: z.string().optional(),
  is_active: z.boolean(),
  role: z.enum(['vendeur', 'acheteur', 'admin']),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }).optional(),
});

export type User = z.infer<typeof UserSchema>;

export const RegisterDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().optional(),
  role: z.enum(['vendeur', 'acheteur', 'admin']),
});

export type RegisterData = z.infer<typeof RegisterDataSchema>;
