
import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get('code');

  const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "Ov23liZpEdu0eKMEAnHR";
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  // Use localhost for local development
  const appBaseUrl = 'http://localhost:9002';
  const homeUrl = new URL(appBaseUrl);

  if (!GITHUB_CLIENT_SECRET) {
    homeUrl.searchParams.set('error', 'Configuration_Error:_Missing_GITHUB_CLIENT_SECRET');
    return NextResponse.redirect(homeUrl);
  }

  if (!code) {
    homeUrl.searchParams.set('error', 'Authorization_Error:_Code_parameter_is_missing');
    return NextResponse.redirect(homeUrl);
  }
  
  // Use localhost for local development callback
  const callbackUrl = 'http://localhost:9002/api/github/callback';

  try {
    const params = new URLSearchParams();
    params.append('client_id', GITHUB_CLIENT_ID);
    params.append('client_secret', GITHUB_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', callbackUrl);

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: params,
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      // Replace spaces with underscores for clean URL transport
      const errorMessage = tokenData.error_description?.replace(/ /g, '_') || 'Unknown_GitHub_Error';
      homeUrl.searchParams.set('error', `GitHub_Error:_${errorMessage}`);
      return NextResponse.redirect(homeUrl);
    }

    const accessToken = tokenData.access_token;
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'DevSensei-App',
      },
    });

    const userData = await userResponse.json();
    
    await createSession({
      accessToken,
      user: {
        id: userData.id,
        username: userData.login,
        avatar: userData.avatar_url,
        name: userData.name || userData.login,
        email: userData.email,
      }
    });

    const dashboardUrl = new URL('/dashboard', appBaseUrl);
    return NextResponse.redirect(dashboardUrl);

  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    homeUrl.searchParams.set('error', 'Internal_Server_Error');
    return NextResponse.redirect(homeUrl);
  }
}
