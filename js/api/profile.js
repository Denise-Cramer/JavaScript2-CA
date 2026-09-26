const API_URL = "https://v2.api.noroff.dev";

/**Retrieve a profile and the profiles posts */

export async function getProfile(name, accessToken, apiKey) {
    const response = await fetch(
        `${API_URL}/social/profiles/${encodeURIComponent(name)}?_posts=true`,
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
            result.errors?.[0]?.message || "Could not load profile",
        );
    }

    return result.data;
}
