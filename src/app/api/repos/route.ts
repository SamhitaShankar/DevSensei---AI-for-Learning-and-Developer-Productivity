
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'User-Agent': 'DevSensei-App',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Failed to fetch repositories', details: errorData.message }, { status: response.status });
    }

    const repos = await response.json();
    
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id.toString(),
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description || "No description provided.",
      language: repo.language || "Unknown",
      stars: repo.stargazers_count,
      updatedAt: new Date(repo.updated_at).toLocaleDateString()
    }));

    return NextResponse.json(formattedRepos);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
