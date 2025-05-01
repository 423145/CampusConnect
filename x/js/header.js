// Header and Profile Management

class HeaderManager {
    constructor() {
        // Initialize elements with reliable selectors
        this.userMenu = document.getElementById('userMenu');
        this.authButtons = document.getElementById('authButtons');
        this.headerAvatar = document.getElementById('headerAvatar');
        this.notificationBadge = document.querySelector('.notification-badge');
        this.navLinks = document.getElementById('navLinks');
        this.adminSection = document.getElementById('adminSection');
        
        // Initialize state from localStorage
        this.updateLoginState();

        // Set up event listeners
        this.setupEventListeners();
        
        // Log initialization
        console.log('HeaderManager initialized, logged in:', this.isLoggedIn);
    }

    updateLoginState() {
        try {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            this.isLoggedIn = !!(user && token);
            
            if (this.isLoggedIn) {
                this.userData = JSON.parse(user);
                // Dispatch a custom event that body elements can listen for
                document.dispatchEvent(new CustomEvent('userLoggedIn', { 
                    detail: { userData: this.userData } 
                }));
            } else {
                this.userData = null;
                // Dispatch logout event
                document.dispatchEvent(new CustomEvent('userLoggedOut'));
            }
            
            return this.isLoggedIn;
        } catch (error) {
            console.error('Error updating login state:', error);
            this.isLoggedIn = false;
            this.userData = null;
            return false;
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const openMenuBtn = document.getElementById('openMenu');
        const closeMenuBtn = document.getElementById('closeMenu');
        
        if (openMenuBtn) {
            openMenuBtn.addEventListener('click', () => {
                if (this.navLinks) this.navLinks.classList.add('active');
            });
        }
        
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                if (this.navLinks) this.navLinks.classList.remove('active');
            });
        }
        
        // User avatar click handler
        if (this.userMenu) {
            const userAvatar = this.userMenu.querySelector('.user-avatar');
            if (userAvatar) {
                userAvatar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown();
                });
            }
        }
        
        // Logout button click handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdownMenu = this.userMenu?.querySelector('.dropdown-menu');
            if (dropdownMenu && 
                dropdownMenu.classList.contains('show') && 
                !this.userMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    toggleDropdown() {
        if (!this.userMenu) return;
        
        const dropdownMenu = this.userMenu.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.toggle('show');
        }
    }

    updateHeaderState() {
        // First update login state
        this.updateLoginState();
        
        try {
            if (this.isLoggedIn && this.userData) {
                // User is logged in
                
                // 1. Show user menu, hide auth buttons
                if (this.userMenu) {
                    this.userMenu.style.display = 'flex';
                }
                
                if (this.authButtons) {
                    this.authButtons.style.display = 'none';
                }
                
                // 2. Update avatar
                if (this.headerAvatar) {
                    if (this.userData.avatar) {
                        this.headerAvatar.src = this.userData.avatar;
                    } else {
                        // Generate avatar from name
                        const name = this.userData.name || '';
                        this.headerAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3498db&color=fff`;
                    }
                    this.headerAvatar.alt = this.userData.name || 'User';
                }
                
                // 3. Check if admin and show admin section
                if (this.adminSection && this.userData.role === 'admin') {
                    this.adminSection.style.display = 'block';
                }
                
                // 4. Handle notification badge
                if (this.notificationBadge) {
                    const count = parseInt(localStorage.getItem('notificationCount')) || 0;
                    if (count > 0) {
                        this.notificationBadge.textContent = count > 9 ? '9+' : count;
                        this.notificationBadge.style.display = 'inline-flex';
                    } else {
                        this.notificationBadge.style.display = 'none';
                    }
                }
                
                console.log('Header updated to logged-in state');
            } else {
                // User is logged out
                
                // 1. Hide user menu, show auth buttons
                if (this.userMenu) {
                    this.userMenu.style.display = 'none';
                }
                
                if (this.authButtons) {
                    this.authButtons.style.display = 'flex';
                }
                
                // 2. Hide admin section
                if (this.adminSection) {
                    this.adminSection.style.display = 'none';
                }
                
                console.log('Header updated to logged-out state');
            }
            
            // Dispatch an event that all page elements can listen for
            document.dispatchEvent(new CustomEvent('headerStateUpdated', { 
                detail: { 
                    isLoggedIn: this.isLoggedIn,
                    userData: this.userData 
                } 
            }));
            
        } catch (error) {
            console.error('Error updating header UI:', error);
        }
    }
    
    logout() {
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        
        // Update UI
        this.updateHeaderState();
        
        // Redirect to home page if not already there
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            window.location.href = '/';
        } else {
            // Just reload the current page
            window.location.reload();
        }
    }
}

// Initialize HeaderManager when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.headerManager = new HeaderManager();
    
    // Update UI
    window.headerManager.updateHeaderState();
    
    // Set up event listeners for login state changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.headerManager) {
            window.headerManager.updateHeaderState();
        }
    });
    
    // Also do a check 500ms after page load to catch any async changes
    setTimeout(() => {
        if (window.headerManager) {
            window.headerManager.updateHeaderState();
        }
    }, 500);
});

// Listen for storage changes to detect login/logout from other tabs
window.addEventListener('storage', (event) => {
    if (event.key === 'user' || event.key === 'token' || event.key === 'isLoggedIn') {
        console.log('Authentication state changed in another tab');
        if (window.headerManager) {
            window.headerManager.updateHeaderState();
        }
    }
});
