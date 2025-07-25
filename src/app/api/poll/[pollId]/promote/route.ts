import { createClient } from '@/lib/supabase/supabaseSSR';
import { NextResponse } from 'next/server';
import { uploadPollImage } from '@/lib/api/theme/uploadImage';

export async function POST(req: Request, { params }: { params: { pollId: string } }) {
  const { pollId } = params;
  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get('month');
  const supabase = await createClient();
  console.log('Poll Id:', pollId);

  // fetch poll data
  const { data: pollData, error: fetchError } = await supabase.from('poll_options').select('*, polls (server_id)').eq('id', pollId).single();
  console.log('Poll Data:', pollData);
  if (fetchError || !pollData) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  // parse image file
  let imageUrl = pollData.image_url || '/no-image-placeholder.jpg';

  // check if image file is set
  if (!pollData.image_url || pollData.image_url.includes('/no-image-placeholder.jpg')) {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}-${file.name}`;

      try {
        imageUrl = await uploadPollImage({
          fileName,
          fileBuffer: buffer,
          serverId: pollData.polls?.server_id,
        });
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
      }
    }
  }

  // promote poll to theme
  const { error } = await supabase.from('themes').insert({
    id: pollData.id,
    name: pollData.name,
    description: pollData.description,
    image_url: imageUrl || '/no-image-placeholder.jpg',
    server_id: pollData.polls?.server_id,
    created_by: pollData.created_by.id,
    theme_month: monthParam,
  });

  if (error) {
    console.error('Error promoting poll to theme:', error);
    return NextResponse.json({ error: 'Failed to promote poll to theme' }, { status: 500 });
  } else {
    // delete poll option after promotion
    const { error: deleteError } = await supabase.from('poll_options').delete().eq('id', pollId);
    if (deleteError) {
      console.error('Error deleting poll:', error);
      return NextResponse.json({ error: 'Failed to remove poll from poll options' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Poll promoted successfully', poll: pollData });
}
