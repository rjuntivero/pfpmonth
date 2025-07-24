import { NextResponse } from 'next/server';
import { promoteTheme, deletePollOption, deleteTheme } from '@/lib/api/theme/themeActions';

// type safe error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function DELETE(req: Request, { params }: { params: { themeId: string } }) {
  const { themeId } = params;

  if (!themeId) {
    return NextResponse.json({ error: 'Missing themeId' }, { status: 400 });
  }

  try {
    await deleteTheme(themeId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { themeId: string } }) {
  const { themeId } = params;

  const body = await req.json();
  const { name, description, image_url, server_id, created_by, theme_month } = body;

  if (!themeId || !name || !server_id || !created_by || !theme_month) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await promoteTheme({ name, description, image_url, server_id, created_by, theme_month });
  } catch (insertError) {
    console.error('Error inserting theme:', insertError);
    return NextResponse.json({ error: getErrorMessage(insertError) }, { status: 500 });
  }

  try {
    await deletePollOption(themeId);
  } catch (deleteError) {
    console.warn('Inserted theme, but failed to delete poll_option:', deleteError);
  }

  return NextResponse.json({ success: true });
}
