import { NextResponse } from 'next/server';
import { createAccount, findAccountByEmail } from '@/backend/models/account';
import { createHash } from 'crypto';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
  }

  const existing = await findAccountByEmail(email);
  if (existing) {
    return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
  }

  const hash = createHash('sha256').update(password).digest('hex');
  await createAccount({ email, passwordHash: hash });
  return NextResponse.json({ message: 'Account created' }, { status: 201 });
}
