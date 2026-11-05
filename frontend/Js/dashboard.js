const API_URL = 'http://localhost:3000';

// --- Auth guard ---
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user) {
    window.location.href = 'index.html'; // not logged in -> back to login
}

// --- Welcome message ---
document.getElementById('welcomeMessage').textContent = `Welcome, ${user.username}!`;

// --- Load protected data using the JWT ---
async function loadProfile() {
    try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
            // token expired or invalid -> force re-login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Your session has expired. Please log in again.');
            window.location.href = 'index.html';
            return;
        }

        const data = await res.json();
        console.log('Protected profile:', data);
        // render data into the page
        document.getElementById('profileData').textContent 
        = `Name: ${data.username},
            Email: ${data.email},
            Phone: ${data.phone},
            Birthdate: ${data.birthdate}`;
    } catch (err) {
        console.error('Cannot reach server:', err);
    }
}

loadProfile();

// --- Logout ---
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});