import { z } from 'zod';

function parseDateFlexible(val: unknown) {
  if (val instanceof Date) return val;
  if (typeof val === 'string') {
    // Cek ISO (YYYY-MM-DD)
    const isoMatch = /^\d{4}-\d{2}-\d{2}/.test(val);
    if (isoMatch) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d;
    }
    // Cek DD-MM-YYYY
    const ddmmyyyy = val.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (ddmmyyyy) {
      const [_, dd, mm, yyyy] = ddmmyyyy;
      const d = new Date(`${yyyy}-${mm}-${dd}`);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return undefined;
}

export const updateProfileSchema = z.object({
  body: z.object({
    whatsapp_number: z.string().optional(),
    location: z.string().optional(),
    date_of_birth: z
      .preprocess(parseDateFlexible, z.date({
        required_error: 'Tanggal lahir wajib diisi',
        invalid_type_error: 'Format tanggal lahir tidak valid (gunakan DD-MM-YYYY atau ISO YYYY-MM-DD)',
      }))
      .optional(),
    last_education: z.string().optional(),
    profile_picture_url: z.string().url('URL gambar profil tidak valid').optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Setidaknya satu field harus diisi untuk melakukan pembaruan.',
  }),
});