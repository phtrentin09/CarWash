import { z } from 'zod';

// Zod schema for registration
export const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(['client', 'owner'], {
    required_error: 'Você deve selecionar uma função.',
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Zod schema for login
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export type LoginInput = z.infer<typeof loginSchema>;