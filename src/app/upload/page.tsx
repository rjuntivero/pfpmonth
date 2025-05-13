'use client';
import { useState } from 'react';
import styles from './page.module.css';
import supabase from '@/utils/supabase';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Upload() {
  const [name, setName] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const uploadTheme = async () => {
    if (!file || !name || !month || !year) return alert('Missing data');

    const monthIndex = MONTHS.findIndex((m) => m.toLowerCase() === month.toLowerCase());
    if (monthIndex === -1) return alert('Invalid month name');

    const filePath = `themes/1369912474324697139/${year}-${month.padStart(2, '0')}`;
    const { error: uploadError } = await supabase.storage.from('theme-images').upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('THERE WAS AN ERROR UPLOADING', uploadError);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('theme-images').getPublicUrl(filePath);
    const parsedStart = new Date(Number(year), monthIndex, 1);

    await supabase.from('themes').upsert(
      {
        name,
        start_date: parsedStart.toISOString().split('T')[0],
        image_url: publicUrlData.publicUrl,
        server_id: '1369912474324697139',
      },
      {
        onConflict: 'server_id, start_date',
      }
    );

    alert('Uploaded!');
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Upload Theme</h1>
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Month (e.g., May)" onChange={(e) => setMonth(e.target.value)} />
        <input type="text" placeholder="Year (e.g., 2025)" onChange={(e) => setYear(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={uploadTheme}>Upload</button>
      </main>
    </div>
  );
}
