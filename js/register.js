import { registerUser } from "./api/auth.js";

const form = document.querySelector("#register-form");
const message = document.querySelector("#register-message");
const button = form.querySelector('button[type="submit"]');

async function handleRegister(event) {
    event.preventDefault();

    const name = form.elements.namedItem("name").value.trim();
    const email = form.elements.namedItem("email").value.trim();
    const password = form.elements.namedItem("password").value;

    message.textContent = "";

    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
        message.textContent = "Name can only contain letters, numbers, and underscores.";
        return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
        message.textContent = "Email must end with @stud.noroff.no.";
        return;
    }

    button.disabled = true;
    button.textContent = "Creating account...";

    try {
        await registerUser({ name, email, password });
        form.requestFullscreen();
        message.textContent = "Account created successfully! You can now log in.";
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
        button.textContent = "Register";
    }
}

form.addEventListener("submit", handleRegister);
button.disabled = false;
