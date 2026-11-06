const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

// Send login data via fetch API
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch('https://dreamy-empanada-55a579.netlify.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        // If login is successful, store the JWT and user data in localStorage
        if (res.ok) {
            // Store token
            localStorage.setItem('token', data.token);
            // Store user info for the UI
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = "dashboard.html";
        } else {
            // Show error message
            errorMsg.textContent = data.message || "Invalid username or password";
            errorMsg.style.display = "block";
        }
    } catch (err) {
        errorMsg.textContent = "Server error. Please try again.";
        errorMsg.style.display = "block";
    }
});