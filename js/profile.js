import { getProfile } from "./api/profile.js";

const message = document.querySelector("#profile-message");
const profileNameElement = document.querySelector("#profile-name");
const bioElement = document.querySelector("#profile-bio");
const countsElement = document.querySelector("#profile-counts");
const postsContainer = document.querySelector("#profile-posts");
const navigation = document.querySelector("#main-nav");

const accessToken = sessionStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const profileName = new URLSearchParams(window.location.search).get("name") || sessionStorage.getItem("name");

function setupNavigation() {
    if (accessToken) {
        const homeLink = document.createElement("a");
        homeLink.href = "./index.html";
        homeLink.textContent = "Home";

        const profileLink = document.createElement("a");
        profileLink.href = "./profile.html";
        profileLink.textContent = "Profile";

        const logoutButton = document.createElement("button");
        logoutButton.type = "button";
        logoutButton.textContent = "Log Out";

        logoutButton.addEventListener("click", () => {
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("name");
            window.location.href = "./login.html";
        });

        navigation.append(homeLink, profileLink, logoutButton);
    } else {
        const loginLink = document.createElement("a");
        loginLink.href = "./login.html";
        loginLink.textContent = "Login";
        navigation.append(loginLink);
    }
}

async function loadProfile() {
    if (!accessToken || !apiKey) {
        message.textContent = "You must be logged in to view a profile";
        return;
    }

    if (!profileName) {
        message.textContent = "No profile was selected";
        return;
    }

    try {
        const profile = await getProfile(profileName, accessToken, apiKey);

        profileNameElement.textContent = profile.name;
        bioElement.textContent = profile.bio || "No bio available";

        countsElement.textContent = `Posts: ${
            profile._count?.posts || profile.posts?.length || 0
        } | Followers: ${profile._count?.followers || 0} | Following: ${
            profile._count?.following || 0 
        }`;

        for (const post of profile.posts || []) {
            const article = document.createElement("article");
            const title = document.createElement("h4");
            const link = document.createElement("a");

            link.href = `./post.html?id=${encodeURIComponent(post.id)}`;
            link.textContent = post.title;

            title.append(link);
            article.append(title);

            if (post.body) {
                const body = document.createElement("p");
                body.textContent = post.body;
                article.append(body);
            }

            postsContainer.append(article);
        }

        message.textContent = "";
    } catch (error) {
        message.textContent = error.message;
    }

}

setupNavigation();
loadProfile();
