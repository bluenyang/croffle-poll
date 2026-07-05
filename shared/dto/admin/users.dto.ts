import { z } from 'zod';

export const UserAddRequestSchema = z.object({
  email: z.email(),
  nickname: z.string().min(1),
  role: z.enum(['ADMIN', 'MEMBER']),
});
export type UserAddRequestDto = z.infer<typeof UserAddRequestSchema>;

export const UserDeleteRequestSchema = z.object({
  userId: z.uuid({ version: 'v7' }),
});
export type UserDeleteRequestDto = z.infer<typeof UserDeleteRequestSchema>;
