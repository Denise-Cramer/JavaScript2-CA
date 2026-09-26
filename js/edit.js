import { getPost, updatePost } from "./api/posts.js";

const form = document.querySelector("#edit-form");
const message = document.querySelector("#edit-message");
const postId = new URLSearchParams(window.location.search).get("id");

async function loadPost() {
    const accessToken = sessionStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || apiKey) {
        message.textContent = "You must be logged in.";
        return;
    }

    if (!postId) {
        message.textContent = "No post was selected.";
        return;
    }

    try {
        const post = await getPost(postId, accessToken, apiKey);

        form.elements.title.value = post.title;
        form.elements.body.value = post.body || "";
    } catch (error) {
        message.textContent = error.message;
    }
}

async function handleEdit(event) {
    event.preventDefault();

    const accessToken = sessionStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    const title = form.elements.title.value.trim();
    const body = form.elements.body.value.trim();

    if (!title) {
        message.textContent = "Title is required";
    return;
    }

    try {
        await updatePost(postId, { title, body }, accessToken, apiKey);

        message.textContent = "Post updated successfully!";

        setTimeout(() => {
            window.location.href = "./index.html";
        }, 700);
    } catch (error) {
        message.textContent = error.message;
    }
}

form.addEventListener("submit", handleEdit);
loadPost ();
