const API_URL = "https://v2.api.noroff.dev";

/** Collects posts from the Noroff API */

export async function getPosts(accessToken, apiKey) {
    const response = await fetch(`${API_URL}/social/posts?_author=true`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Failed to fetch posts");
    }

    return result.data;
}

/** Collects and displays one post */

export async function getPost(postId, accessToken, apiKey) {
    const response = await fetch(`${API_URL}/social/posts/${encodeURIComponent(postId)}?_author=true`, 
    {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
        },
    },
);

const result = await response.json();

if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || "Failed to load post");
}

return result.data;
}
