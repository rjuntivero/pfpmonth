import { createTheme } from '@/lib/api/theme/themeActions';
import { NextResponse } from 'next/server';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// create new theme
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, image_url, server_id, created_by, theme_month } = body;

    if (!name || !server_id || !created_by || !theme_month) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { id } = await createTheme({ name, description, image_url, server_id, created_by, theme_month });
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
