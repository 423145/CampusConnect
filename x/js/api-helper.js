// API Helper for CampusConnect
// This utility adds authentication to all API requests

(function() {
    // API Base URL
    const API_BASE_URL = 'http://localhost:3000/api';
    
    // Create a centralized fetch function that adds auth headers
    window.apiRequest = async function(endpoint, options = {}) {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Build headers with authentication
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options.headers || {})
        };
        
        console.log(`Making API request to: ${endpoint}`);
        console.log('With auth header:', token ? 'Yes' : 'No');
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });
            
            // Handle common response scenarios
            if (response.status === 401) {
                console.error('Authentication failed - redirecting to login');
                // Optionally redirect to login page
                // window.location.href = '/pages/login.html';
                return { error: 'Authentication failed' };
            }
            
            // Return json response
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            return { error: error.message };
        }
    };
    
    // Intercept all fetch requests to add auth headers (advanced approach)
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        // Only intercept API calls to our backend
        if (url.includes('localhost:3000/api')) {
            const token = localStorage.getItem('token');
            
            if (token) {
                // Create headers object if it doesn't exist
                options.headers = options.headers || {};
                
                // Add auth header if not already present
                if (typeof options.headers.Authorization === 'undefined' &&
                    typeof options.headers.authorization === 'undefined') {
                    options.headers.Authorization = `Bearer ${token}`;
                    console.log('Fetch interceptor: Added auth header to request');
                }
            }
        }
        
        return originalFetch.call(window, url, options);
    };
    
    // Function to update user profile using our authenticated method
    window.updateProfile = async function(userId, data) {
        return apiRequest(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    };
    
    // Function to get user profile using our authenticated method
    window.getProfile = async function(userId) {
        return apiRequest(`/users/${userId}`);
    };
    
    console.log('API Helper initialized - Adding auth headers to all API requests');
})();
