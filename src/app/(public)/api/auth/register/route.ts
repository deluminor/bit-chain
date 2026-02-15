import { NextResponse } from 'next/server';

// Registration is temporarily disabled
export async function POST() {
  return NextResponse.json({ error: 'Registration is disabled' }, { status: 404 });
}
