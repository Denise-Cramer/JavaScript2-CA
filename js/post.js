import { getPost } from "./api/posts.js";

const container = document.querySelector("#post-container");
const message = document.querySelector("#post-message");
const postId = new URLSearchParams(window.location.search).get("id");

async function loadPost() {
    const accessToken = sessionStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || !apiKey) {
        message.textContent = "You must be logged in to view this post.";
        return;
    }

    if (!postId) {
        message.textContent = "No post was selected.";
        return;
    }

    try {
        const post = await getPost(postId, accessToken, apiKey);

        const title = document.createElement("h2");
        title.textContent = post.title;

        const author = document.createElement("p");
        author.textContent = `By ${post.author?.name || "Unknown author"}`;        

        const body = document.createElement("p");
        body.textContent = post.body;

        container.append(title, author, body);

        if (post.media?.url) {
            const image = document.createElement("img");
            image.src = post.media.url;
            image.alt = post.media.alt || post.title;
            image.width = "400";
            container.append(image);
        }

        message.textContent = "";
    } catch (error) {
        message.textContent = error.message;
    }
}

loadPost();
