import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Credentials Sertifikat | PalComTech', description: 'Verifikasi credentials sertifikat kursus.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body>{children}</body></html>; }
