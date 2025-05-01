// Force Login Helper - Development utilities for login state management
// This file has been disabled to remove fix buttons from UI

// Original functionality is commented out to preserve the code for reference
/*
document.addEventListener('DOMContentLoaded', () => {
    // Sample user data - use the one that matches your login
    const userSamples = [
        {
            id: "680e11a33cb8a90cf759d287",
            email: "thecolumbus526@gmail.com",
            name: "columbus",
            role: "prospective",
            avatar: "../assets/default-avatar.png"
        },
        {
            id: "680e12d4d7b4dd4849eb9aa3",
            email: "423145@student.nitandhra.ac.in",
            name: "Toney vivek",
            role: "current" 
        }
    ];
    
    // Manual login function that can be called from console for development
    window.forceLogin = (userIndex = 0) => {
        const userData = userSamples[userIndex];
        
        // Set the localStorage values
        localStorage.setItem('token', 'fake-token-for-development-' + Date.now());
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Force-saved user data to localStorage:', userData);
        
        // Try to trigger header update
        if (window.headerManager) {
            window.headerManager.updateHeaderState();
            console.log('Triggered headerManager.updateHeaderState()');
        }
        
        return 'Login state forced! Check console logs for details.';
    };
});
*/

// Instead, just provide a programmatic way to force login via console
// This doesn't add any buttons to the UI
(function() {
    // Sample user data
    const userSamples = [
        {
            id: "680e11a33cb8a90cf759d287",
            email: "thecolumbus526@gmail.com",
            name: "columbus",
            role: "prospective",
            avatar: "../assets/default-avatar.png"
        },
        {
            id: "680e12d4d7b4dd4849eb9aa3",
            email: "423145@student.nitandhra.ac.in",
            name: "Toney vivek",
            role: "current" 
        }
    ];
    
    // Add utility function to window for console use only
    window.forceLogin = function(userIndex = 0) {
        const userData = userSamples[userIndex];
        
        // Set the localStorage values
        localStorage.setItem('token', 'fake-token-for-development-' + Date.now());
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Force-saved user data to localStorage:', userData);
        
        // Try to trigger header update
        if (window.headerManager) {
            window.headerManager.updateHeaderState();
            console.log('Triggered headerManager.updateHeaderState()');
        }
        
        return 'Login state forced! Check console logs for details.';
    };
})();
