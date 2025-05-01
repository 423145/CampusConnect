// Admin Authentication Check

class AdminAuthCheck {
    constructor() {
        this.checkAdminAuth();
    }

    checkAdminAuth() {
        try {
            // Get admin session from localStorage
            const adminSession = JSON.parse(localStorage.getItem('adminSession'));

            // Check if admin session exists and is valid
            if (!adminSession || !adminSession.user || adminSession.user.role !== 'admin') {
                console.log('Access denied: User is not an admin');
                this.redirectToLogin();
                return false;
            }

            // Check session expiration
            const expirationTime = new Date(adminSession.expiresAt).getTime();
            if (!expirationTime || new Date().getTime() > expirationTime) {
                console.log('Session expired');
                localStorage.removeItem('adminSession');
                this.redirectToLogin();
                return false;
            }

            console.log('Admin authentication successful');
            return true;
        } catch (error) {
            console.error('Error checking admin auth:', error);
            this.redirectToLogin();
            return false;
        }
    }

    redirectToLogin() {
        // Store the current URL to redirect back after login
        const currentPath = window.location.pathname;
        const redirectUrl = encodeURIComponent(`${window.location.origin}${currentPath}`);
        
        // Redirect to login page with return URL
        window.location.href = `../pages/login.html?redirect=${redirectUrl}`;
    }

    static init() {
        return new AdminAuthCheck();
    }
}

// Initialize auth check when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AdminAuthCheck.init();
});