import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) return NextResponse.json({ error: 'Credential tidak ditemukan.' }, { status: 404 });
  try {
    const { data, error } = await getSupabase()
      .from('credentials')
      .select('name, program, grade')
      .eq('id', params.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Credential tidak ditemukan.' }, { status: 404 });
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Layanan verifikasi belum dikonfigurasi.' }, { status: 503 });
  }
}
