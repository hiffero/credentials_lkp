import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!isAdmin(body.password)) return NextResponse.json({ error: 'Password admin salah.' }, { status: 401 });
    const { data, error } = await getSupabase()
      .from('credentials')
      .select('id, name, program, grade, class_name, created_at')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) throw new Error(`Gagal membaca data Supabase: ${error.message}`);
    return NextResponse.json({ records: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Gagal mengambil data.' }, { status: 500 });
  }
}
