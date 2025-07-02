import { z } from 'zod';

export const getUsersSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    roleId: z.string().optional(),
  }),
});

export const userPathParamsSchema = z.object({
  params: z.object({
    id: z.string({
        required_error: "User ID di dalam path URL diperlukan."
    }),
  }),
});

export const updateUserSchema = z.object({
  params: userPathParamsSchema.shape.params,
  body: z
    .object({
      name: z.string().min(3, 'Nama minimal harus 3 karakter').optional(),
      email: z.string().email('Format email tidak valid').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Setidaknya satu field (name atau email) harus diisi untuk melakukan update.',
    }),
});
