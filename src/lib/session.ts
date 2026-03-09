
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'devsensei_session';

export interface SessionData {
  accessToken: string;
  user: {
    id: number;
    username: string;
    avatar: string;
    name: string;
    email?: string;
  };
}

export async function createSession(data: SessionData) {
  const sessionData = JSON.stringify(data);
  cookies().set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookie = cookies().get(SESSION_COOKIE_NAME);
  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value);
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
