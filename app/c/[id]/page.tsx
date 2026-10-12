'use client';
import { useEffect, useState } from 'react';
type Credential = { name: string; program: string; grade: string };
export default function CredentialPage({ params }: { params: { id: string } }) {
  const [data,setData] = useState<Credential|null>(null); const [error,setError] = useState('');
  useEffect(()=>{ fetch(`/api/credential/${params.id}`,{cache:'no-store'}).then(async r=>{const j=await r.json();if(!r.ok)throw new Error(j.error||'Data tidak ditemukan.');setData(j)}).catch(e=>setError(e.message)); },[params.id]);
  return <main className="wrap"><section className="card credential"><div className="brand"><div className="brand-mark">PC</div><div><b>LKP PalComTech Palembang</b><div className="small muted">Credentials Sertifikat</div></div></div><p className="eyebrow">Certificate Credentials</p><h1 className="title">Informasi Sertifikat</h1>{error?<div className="notice error">{error}</div>:!data?<p className="muted">Memuat data credentials…</p>:<><div className="credential-value"><small>Nama</small><strong>{data.name}</strong></div><div className="credential-value"><small>Program Kursus</small><strong>{data.program}</strong></div><div className="credential-value"><small>Nilai</small><strong>{data.grade}</strong></div></>}<div className="issuer">Diterbitkan oleh <b>LKP PalComTech Palembang</b><br/>Bekerja sama dengan Universitas Muhammadiyah Palembang</div></section></main>;
}
