const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const payload = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birthdate: document.getElementById('birthdate').value,
        password: document.getElementById('password').value
    };
    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
            alert(data.message || 'Registration failed');
            return;
        }
        alert('Registration successful!');
        window.location.href = 'index.html';
    } catch (err) {
        alert('Cannot reach server. Is the backend running?');
    }
});