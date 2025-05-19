import { createClient } from '@/utils/supabaseSSR';
import { NextRequest, NextResponse } from 'next/server';
import { uploadThemeImage } from '@/lib/uploadImage';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const form = await req.formData();

  const file = form.get('theme-image');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
  }

  const poll_id = form.get('poll_id')?.toString();
  const name = form.get('theme-name')?.toString();
  const option_text = form.get('theme-description')?.toString();
  const month = form.get('month')?.toString();
  const year = form.get('year')?.toString();
  const serverId = form.get('server_id')?.toString();

  if (!poll_id || !name || !option_text || !month || !year || !serverId) {
    return NextResponse.json({ error: 'Missing required form fields' }, { status: 400 });
  }

  const yearMonth = `${year}-${month}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const image_url = await uploadThemeImage({ fileName: file.name, fileBuffer, serverId, yearMonth });

  const { error } = await supabase.from('poll_options').insert([{ poll_id, created_by: user.id, name, option_text, image_url }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
