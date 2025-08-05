import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabaseSSR';
import { updateCharacterImage } from '@/lib/api/user/characterActions';
import { Buffer } from 'buffer';

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'No user session' }, { status: 401 });
  }

  const body = await req.json();
  const { themeId, fileBase64, fileName, fileType } = body;

  if (!fileBase64 || !fileName) {
    return NextResponse.json({ success: false, error: 'Missing file data' }, { status: 400 });
  }

  // Remove data URI prefix if exists
  const base64Data = fileBase64.replace(/^data:\w+\/\w+;base64,/, '');
  const fileBuffer = Buffer.from(base64Data, 'base64');

  // Call your reusable function here
  const updatedCharacter = await updateCharacterImage(themeId, user.id, fileBuffer, fileName, fileType);

  if (!updatedCharacter) {
    return NextResponse.json({ success: false, error: 'Failed to update character image' }, { status: 500 });
  }

  return NextResponse.json({ success: true, character: updatedCharacter });
}
