// Login Detector - Simple utility to consistently detect login state across pages
// Add this to all pages to ensure login state is properly detected

(function() {
    // Function to check login state
    function checkLoginState() {
        // Get stored user data and token
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        // Log current state
        console.log('⭐ Login Detector: Checking login state');
        console.log('Token exists:', !!token);
        console.log('User exists:', !!user);
        
        try {
            // If both exist, we're logged in
            if (user && token) {
                const userData = JSON.parse(user);
                console.log('✅ LOGGED IN AS:', userData.email);
                console.log('User data:', userData);
                
                // Make sure header knows we're logged in
                if (window.headerManager) {
                    // Use the updated method in HeaderManager
                    window.headerManager.updateHeaderState();
                    console.log('Updated header state via HeaderManager');
                } else {
                    console.warn('HeaderManager not found - waiting for it to initialize');
                    // HeaderManager might not be initialized yet, so we'll wait a bit
                    setTimeout(() => {
                        if (window.headerManager) {
                            window.headerManager.updateHeaderState();
                            console.log('Updated header state via HeaderManager (delayed)');
                        }
                    }, 200);
                }
                
                // Return true - we're logged in
                return true;
            } else {
                console.log('❌ NOT LOGGED IN - missing token or user data');
                // Also make sure header shows logged out state
                if (window.headerManager) {
                    window.headerManager.updateHeaderState();
                }
                return false;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            return false;
        }
    }
    
    // Run immediately when script loads
    const isLoggedIn = checkLoginState();
    
    // Add a global function to check login state that other scripts can use
    window.isUserLoggedIn = function() {
        return checkLoginState();
    };
    
    // Listen for header state updates from HeaderManager
    document.addEventListener('headerStateUpdated', (event) => {
        console.log('Login Detector: Received headerStateUpdated event', event.detail);
        // No need to do anything - HeaderManager is handling the UI
    });
})();
