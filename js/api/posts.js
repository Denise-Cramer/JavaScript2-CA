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

/** Creates a new post */

export async function createPost(post, accessToken, apiKey) {
    const response = await fetch(`${API_URL}/social/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify(post),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Failed to create post", 
        );
    }

    return result.data;
}

/** Updates an existing post */

export async function updatePost(postId, post, accessToken, apiKey) {
    const response = await fetch(
        `${API_URL}/social/posts/${encodeURIComponent(postId)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": apiKey,
            },
            body: JSON.stringify(post),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.errors?.[0]?.message || "Failed to update post",
        );
    }

    return result.data;
}


/** Deletes an existing post */

export async function deletePost(postId, accessToken, apiKey) {
    const response = await fetch(
        `${API_URL}/social/posts/${encodeURIComponent(postId)}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": apiKey,
            },
        },
    );

    if (!response.ok) {
        const result = await response.json();
        throw new Error(
            result.errors?.[0]?.message || "Could not delete post",
        );
    }
    return true;
}

/** Search post by title or text */

export async function searchPosts(query, accessToken, apiKey) {
    const response = await fetch(
        `${API_URL}/social/posts/search?q=${encodeURIComponent(query)}&_author=true`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": apiKey,
            },
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.errors?.[0]?.message || "Failed to search post",
        );
    }

    return result.data;
}
