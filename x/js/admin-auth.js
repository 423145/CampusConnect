// Admin Authentication Handler

class AdminAuthHandler {
    constructor() {
        this.adminSection = document.getElementById('adminSection');
        this.init();
    }

    init() {
        this.checkAdminStatus();
        this.setupAdminAuthListeners();
    }

    checkAdminStatus() {
        const session = this.getAdminSession();
        if (session && session.user && session.user.role === 'admin') {
            this.showAdminButton();
        } else {
            this.hideAdminButton();
        }
    }

    getAdminSession() {
        const session = localStorage.getItem('adminSession');
        return session ? JSON.parse(session) : null;
    }

    showAdminButton() {
        if (this.adminSection) {
            this.adminSection.style.display = 'block';
        }
    }

    hideAdminButton() {
        if (this.adminSection) {
            this.adminSection.style.display = 'none';
        }
    }

    setupAdminAuthListeners() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminSession') {
                this.checkAdminStatus();
            }
        });

        // Listen for custom events
        document.addEventListener('adminLogin', () => this.checkAdminStatus());
        document.addEventListener('adminLogout', () => this.hideAdminButton());
    }
}

// Initialize admin auth handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminAuthHandler();
});