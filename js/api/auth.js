const API_URL = "https://v2.api.noroff.dev";

export async function registerUser(user) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Registration failed");  
    }

    return result.data;
}

export async function loginUser(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Login failed");
    }
    return result.data;
}

/**API-key */

export async function createApiKey(accessToken) {
    const response = await fetch(`${API_URL}/auth/create-api-key`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "API key creation failed");
    }

    return result.data.key;
}
