import { NextResponse } from 'next/server';
import { findAccountByEmail } from '@/backend/models/account';
import { createHash } from 'crypto';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
  }

  const account = await findAccountByEmail(email);
  if (!account) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  const hash = createHash('sha256').update(password).digest('hex');
  if (hash !== account.passwordHash) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  return NextResponse.json({ message: 'Signed in', userId: account.id });
}
