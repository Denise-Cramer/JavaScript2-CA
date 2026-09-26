import { getPosts, deletePost } from "./api/posts.js";

const postsContainer = document.querySelector("#posts");
const message = document.querySelector("#feed-message");

/** Loads and displays the latest posts */

async function loadFeed() {
    const accessToken = sessionStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");
    const currentUser = sessionStorage.getItem("name");

    if (!accessToken || !apiKey) {
        message.textContent = "You must be logged in to view the feed.";
        return;
    }

    try {
        const posts = await getPosts(accessToken, apiKey);
        postsContainer.replaceChildren();

        for (const post of posts) {
            const article = document.createElement("article");
            const heading = document.createElement("h3");
            const link = document.createElement("a");

            link.href = `./post.html?id=${encodeURIComponent(post.id)}`;
            link.textContent = post.title;

            heading.append(link);
            article.append(heading);

            if (post.author?.name) {
                const author = document.createElement("p");
                author.textContent = `By ${post.author.name}`;
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

loadFeed();
