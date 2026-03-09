import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

type Params = {
  owner: string;
  repo: string;
  path?: string[];
};

// Function to get repo contents (files or folders)
async function getRepoContents(
  accessToken: string,
  owner: string,
  repo: string,
  path: string
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "DevSensei-App",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error for contents: ${response.status} at ${url}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type === "dir" ? "folder" : "file",
      sha: item.sha,
      size: item.size,
    }));
  }

  return {
    name: data.name,
    path: data.path,
    type: "file",
    content: data.content,
    encoding: data.encoding,
  };
}

// Function to get the full repository tree
async function getRepoFullTree(
  accessToken: string,
  owner: string,
  repo: string
) {
  const repoInfoResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "DevSensei-App",
      },
    }
  );

  if (!repoInfoResponse.ok) {
    throw new Error(`GitHub API error for repo info: ${repoInfoResponse.status}`);
  }

  const repoInfo = await repoInfoResponse.json();
  const branch = repoInfo.default_branch || "main";

  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "DevSensei-App",
      },
    }
  );

  if (!treeResponse.ok) {
    throw new Error(`GitHub API error for tree: ${treeResponse.status}`);
  }

  const data = await treeResponse.json();
  return data.tree;
}

export async function GET(
  req: Request,
  context: { params: Promise<Params> }
) {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // IMPORTANT: await params
  const params = await context.params;
  const owner = params?.owner;
  const repo = params?.repo;

  if (!owner || !repo) {
    console.error("Repo API missing params:", params);

    return NextResponse.json(
      { error: "Missing repository parameters" },
      { status: 400 }
    );
  }

  const url = new URL(req.url);
  const isTreeRequest = url.searchParams.get("tree") === "true";
  const path = url.searchParams.get("path") || "";

  try {
    if (isTreeRequest) {
      const tree = await getRepoFullTree(session.accessToken, owner, repo);
      return NextResponse.json(tree);
    }

    const contents = await getRepoContents(
      session.accessToken,
      owner,
      repo,
      path
    );

    return NextResponse.json(contents);

  } catch (error: any) {
    console.error("Repo API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch repository data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}