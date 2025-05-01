// Add this script to any page to provide a direct profile link
document.addEventListener('DOMContentLoaded', () => {
    // Create a prominent button for profile navigation
    const fixButton = document.createElement('button');
    fixButton.textContent = 'Go to Profile';
    fixButton.style.position = 'fixed';
    fixButton.style.top = '100px';
    fixButton.style.right = '20px';
    fixButton.style.zIndex = '9999';
    fixButton.style.padding = '10px 20px';
    fixButton.style.backgroundColor = '#4CAF50';
    fixButton.style.color = 'white';
    fixButton.style.border = 'none';
    fixButton.style.borderRadius = '5px';
    fixButton.style.cursor = 'pointer';
    
    // Add click handler
    fixButton.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('Direct profile navigation. User:', user);
        
        if (user && user.id) {
            // Navigate to profile with user ID
            const path = window.location.pathname.includes('/pages/') ? 
                'profile.html' : 'pages/profile.html';
            
            console.log(`Navigating to: ${path}?id=${user.id}`);
            window.location.href = `${path}?id=${user.id}`;
        } else {
            alert('User information not found. Please try logging in again.');
        }
    });
    
    // Add to page
    document.body.appendChild(fixButton);
    
    // Log what's in local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    console.log('==== PROFILE FIX SCRIPT ====');
    console.log('User in localStorage:', user);
    console.log('Token in localStorage:', token ? 'Found token' : 'No token');
});
