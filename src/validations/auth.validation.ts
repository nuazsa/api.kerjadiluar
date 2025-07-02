import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z
    .string({ required_error: 'Nama wajib diisi' })
    .min(3, 'Nama minimal harus 3 karakter'),
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid'),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(8, 'Password minimal harus 8 karakter'),
  roleId: z.coerce 
    .string({required_error: 'Role ID wajib diisi'})
});

export const loginUserSchema = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid'),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(8, 'Password minimal harus 8 karakter')
});