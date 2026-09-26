import { createPost } from "./api/posts.js";

const form = document.querySelector("#create-form");
const message = document.querySelector("#create-message");

async function handleCreatePost(event) {
    event.preventDefault();

    const accessToken = sessionStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || !apiKey) {
        message.textContent = "You must be logged in to create a post.";
        return;
    }

    const title = form.elements.title.value.trim();
    const body = form.elements.body.value.trim();

    try {
        await createPost({ title, body }, accessToken, apiKey);
        
        message.textContent = "Post created successfully!";
        form.reset();
    } catch (error) {
        message.textContent = error.message;
    }
}

form.addEventListener("submit", handleCreatePost);
