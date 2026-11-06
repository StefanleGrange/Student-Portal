const registerForm = document.getElementById('registerForm');
const errorMsg = document.getElementById('errorMsg');

// Send registration data to the backend
registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('https://dreamy-empanada-55a579.netlify.app/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, phone, dob, password })
        });

        const data = await res.json();
        // If registration succeeds, alert user and redirect to login
        if (res.ok) {
            alert('Registration successful! Please log in.');
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = data.message || "Registration failed";
            errorMsg.style.display = "block";
        }
    } catch (err) {
        errorMsg.textContent = "Server error. Please try again.";
        errorMsg.style.display = "block";
    }
});