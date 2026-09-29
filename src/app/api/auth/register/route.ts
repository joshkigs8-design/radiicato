import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mmxosaqhcuikgbzqlpgk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1teG9zYXFoY3Vpa2dienFscGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYyNzQ4OCwiZXhwIjoyMDk0MjAzNDg4fQ.9SUBRBm-M7CBRRo7F-JNgYGC-uGP1hihLErr1KtNC4U';

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if user already exists
    const { data: usersData } = await adminClient.auth.admin.listUsers();
    const existingUser = usersData?.users?.find((u) => u.email?.toLowerCase() === trimmedEmail);

    if (existingUser) {
      // If user exists and email is not confirmed, confirm it and update password so they can log in
      if (!existingUser.email_confirmed_at) {
        await adminClient.auth.admin.updateUserById(existingUser.id, {
          email_confirm: true,
          password: password,
          user_metadata: { full_name: fullName || existingUser.user_metadata?.full_name || '' },
        });
        return NextResponse.json({ success: true, message: 'Account confirmed and updated.' });
      }
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.', code: 'user_exists' },
        { status: 400 }
      );
    }

    // Create user with email_confirm: true so customer does NOT get blocked
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: trimmedEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || '',
      },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: newUser.user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
