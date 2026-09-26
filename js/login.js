import { loginUser } from "./api/auth.js";

const form =document.querySelector("#login-form");
const message = document.querySelector("#login-message");
const button = form.querySelector('button[type="submit"]');

async function handleLogin(event) {
    event.preventDefault();

    const email = form.elements.namedItem("email").value.trim();
    const password = form.elements.namedItem("password").value;

    message.textContent = "";
    button.disabled = true;
    button.textContent = "Logging in...";

    try {
        const user = await loginUser({ email, password });

        sessionStorage.setItem("accessToken", user.accessToken);
        sessionStorage.setItem("name", user.name);

        form.reset();
        message.textContent = `Welcome, ${user.name}! You are now logged in.`;
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
        button.textContent = "Login";
    }
}

form.addEventListener("submit", handleLogin);
button.disabled = false;
