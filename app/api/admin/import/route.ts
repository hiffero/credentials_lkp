import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSupabase } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!isAdmin(body.password)) return NextResponse.json({ error: 'Password admin salah.' }, { status: 401 });
    if (!Array.isArray(body.records) || body.records.length === 0) return NextResponse.json({ error: 'Tidak ada data untuk diimpor.' }, { status: 400 });
    if (body.records.length > 2000) return NextResponse.json({ error: 'Maksimal 2.000 peserta per proses impor.' }, { status: 400 });

    const program = String(body.program || '').trim();
    const className = String(body.className || '').trim();
    if (!program || !className) return NextResponse.json({ error: 'Program kursus dan nama kelas wajib diisi.' }, { status: 400 });

    const rows = body.records
      .map((r: any) => ({ name: String(r.name || '').trim(), grade: String(r.grade ?? '').trim() }))
      .filter((r: any) => r.name && r.grade !== '' && r.name.length <= 200 && r.grade.length <= 30);
    if (!rows.length) return NextResponse.json({ error: 'Tidak ada baris valid. Periksa pemetaan kolom nama dan nilai.' }, { status: 400 });

    const supabase = getSupabase();
    const payload = rows.map((r: { name: string; grade: string }) => ({
      id: randomUUID(), name: r.name, program, grade: r.grade, class_name: className,
    }));

    // Kirim per 500 baris untuk menjaga ukuran request tetap wajar.
    for (let i = 0; i < payload.length; i += 500) {
      const { error } = await supabase.from('credentials').insert(payload.slice(i, i + 500));
      if (error) throw new Error(`Gagal menyimpan data ke Supabase: ${error.message}`);
    }

    return NextResponse.json({ imported: rows.length, skipped: body.records.length - rows.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Gagal mengimpor data.' }, { status: 500 });
  }
}
