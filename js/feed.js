import { getPosts} from "./api/posts.js";

const postsContainer = document.querySelector("#posts");
const message = document.querySelector("#feed-message");

/** Loads and displays the latest posts */

async function loadFeed() {
    const token = sessionStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    if (!token || !apiKey) {
        message.textContent = "You must be logged in to view the feed.";
        return;
    }

    try {
        const posts = await getPosts(token, apiKey);
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

            postsContainer.append(article);
        }

        message.textContent = posts.length ? "" : "No posts found.";
    } catch (error) {
        message.textContent = error.message;
    }
}

loadFeed();
