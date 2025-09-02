import { createClient } from '@/lib/supabase/supabaseSSR';
import { NextRequest, NextResponse } from 'next/server';
import { fetchPollOptions } from '@/lib/api/poll/fetchPollOptions';
import { uploadPollImage } from '@/lib/api/poll/pollActions';

interface Props {
  pollId: string;
}

// get poll options for the server
export async function GET(req: NextRequest, { params }: { params: Promise<Props> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { pollId } = await params;

  if (!pollId) {
    return NextResponse.json({ error: 'Missing pollId' }, { status: 400 });
  }

  const { pollOptions } = await fetchPollOptions(pollId);

  return NextResponse.json({ pollOptions });
}

// create a poll option
export async function POST(req: NextRequest, { params }: { params: Promise<Props> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { pollId: poll_id } = await params;

  const form = await req.formData();

  const file = form.get('theme-image');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
  }

  const name = form.get('theme-name')?.toString();
  const option_text = form.get('theme-description')?.toString();
  const serverId = form.get('server_id')?.toString();

  console.log('Form fields:', { poll_id, name, option_text, serverId });
  if (!poll_id || !name || !option_text || !serverId) {
    return NextResponse.json({ error: 'Missing required form fields' }, { status: 400 });
  }

  // upload poll image to supabase storage
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const image_url = await uploadPollImage({ fileName: file.name, fileBuffer, serverId });

  // upload poll option
  const { error } = await supabase.from('poll_options').insert([{ poll_id, created_by: user.id, name, option_text, image_url, server_id: serverId }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
