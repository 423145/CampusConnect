// Control admin section visibility in footer
document.addEventListener('DOMContentLoaded', function() {
    const footerAdminSection = document.getElementById('footerAdminSection');
    
    // Check if user is admin (reusing existing admin check logic)
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // Show/hide admin section in footer
    if (footerAdminSection) {
        footerAdminSection.style.display = isAdmin ? 'block' : 'none';
    }
});