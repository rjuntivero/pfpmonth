import { NextResponse } from 'next/server';
import { deleteTheme, updateTheme } from '@/lib/api/theme/themeActions';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

interface Props {
  themeId: string;
}

// delete a theme given themeId
export async function DELETE(req: Request, { params }: { params: Promise<Props> }) {
  const { themeId } = await params;

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

// update existing theme
export async function PATCH(req: Request, { params }: { params: { themeId: string } }) {
  const { themeId } = params;
  try {
    const body = await req.json();
    const { name, description, image_url } = body;

    if (!themeId) {
      return NextResponse.json({ error: 'Missing themeId' }, { status: 400 });
    }

    await updateTheme(themeId, { name, description, image_url });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
