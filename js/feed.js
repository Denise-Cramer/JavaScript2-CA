import { getPosts, deletePost, searchPosts } from "./api/posts.js";

const postsContainer = document.querySelector("#posts");
const message = document.querySelector("#feed-message");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchButton = searchForm.querySelector('button[type="submit"]');

/** Loads and displays the latest posts */

async function loadFeed(query = "") {
    const accessToken = sessionStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");
    const currentUser = sessionStorage.getItem("name");

    if (!accessToken || !apiKey) {
        message.textContent = "You must be logged in to view the feed.";
        return;
    }

    try {
        message.textContent = "Loading posts...";

        const posts = query
            ? await searchPosts(query, accessToken, apiKey)
            : await getPosts(accessToken, apiKey);
        postsContainer.replaceChildren();

        for (const post of posts) {
            const article = document.createElement("article");
            const heading = document.createElement("h3");
            const link = document.createElement("a");

            link.href = `./post.html?id=${encodeURIComponent(post.id)}`;
            link.textContent = post.title;

            heading.append(link);
            article.append(heading);

            if (post.media?.url) {
                const image = document.createElement("img");
                image.src = post.media.url;
                image.alt = post.media.alt || post.title;
                image.loading = "lazy";

                article.append(image);
            }

            if (post.author?.name) {
                const author = document.createElement("p");
                const authorLink = document.createElement("a");

                authorLink.href =
                `./profile.html?name=${encodeURIComponent(post.author.name)}`;
                authorLink.textContent = post.author.name;


                author.append("By ", authorLink);
                article.append(author);
            }

            if (post.author?.name === currentUser) {
                const editLink = document.createElement("a");
                editLink.href = `./edit.html?id=${encodeURIComponent(post.id)}`;
                editLink.textContent = "Edit";

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", async () => {
                    const confirmed = window.confirm(
                        "Are you sure you want to delete this post?",
                    );

                    if (!confirmed) {
                        return;
                    }

                    deleteButton.disabled = true;

                    try {
                        await deletePost(post.id, accessToken, apiKey);
                        article.remove();
                        message.textContent = "Post deleted.";
                    } catch (error) {
                        message.textContent = error.message;
                        deleteButton.disabled = false;
                    }
                });

                article.append(editLink, deleteButton);
            }

            postsContainer.append(article);
        }

        message.textContent = posts.length ? "" : "No posts found.";
    } catch (error) {
        message.textContent = error.message;
    }
}
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    searchButton.disabled = true;

    try {
        await loadFeed(searchInput.value.trim());
    } finally {
        searchButton.disabled = false;
    }
});

loadFeed();
