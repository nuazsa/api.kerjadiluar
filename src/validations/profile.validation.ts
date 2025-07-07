import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    whatsapp_number: z.string().optional(),
    location: z.string().optional(),
    date_of_birth: z.coerce.date().optional(),
    last_education: z.string().optional(),
    profile_picture_url: z.string().url('URL gambar profil tidak valid').optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Setidaknya satu field harus diisi untuk melakukan pembaruan.',
  }),
});