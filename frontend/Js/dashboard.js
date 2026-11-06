const API_URL = 'https://dreamy-empanada-55a579.netlify.app';
const token = localStorage.getItem('token');
const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

// Security: If not logged in, kick back to login
if (!token || !storedUser) {
    window.location.href = 'index.html';
}

// Display user info
document.getElementById('profileHeader').textContent = `Profile: ${storedUser.username}`;
document.getElementById('email').value = storedUser.email || '';
document.getElementById('phone').value = storedUser.phone || '';
document.getElementById('dob').value = storedUser.dob ? storedUser.dob.split('T')[0] : '';

const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');

document.getElementById('profileForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Validate inputs
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;

    if (!validateEmail(email)) {
        errorMsg.textContent = "Please enter a valid email address.";
        errorMsg.style.display = "block";
        return;
    }
    if (!/^\d+$/.test(phone)) {
        errorMsg.textContent = "Phone number must contain only digits.";
        errorMsg.style.display = "block";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/auth/profile/${storedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email, phone, dob })
        });

        const data = await res.json();

        // If update is successful, refresh local storage and UI
        if (res.ok) {
            // Update local storage and UI
            localStorage.setItem('user', JSON.stringify(data.user));
            document.getElementById('profileHeader').textContent = `Profile: ${data.user.username}`;
            successMsg.style.display = "block";
            errorMsg.style.display = "none";
        } else {
            errorMsg.textContent = data.message || "Failed to update profile.";
            errorMsg.style.display = "block";
            successMsg.style.display = "none";
        }
    } catch (err) {
        errorMsg.textContent = "Server error. Please try again.";
        errorMsg.style.display = "block";
    }
});

// Helper for validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Logout: clear stored credentials and redirect to login page
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});