// Profile Data Management Module

const PROFILE_DATA = {
    // Initialize profile data from db
    initializeFromDb() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        users.forEach(user => {
            // Initialize achievements
            if (!localStorage.getItem(`achievements_${user.id}`)) {
                localStorage.setItem(`achievements_${user.id}`, JSON.stringify([]));
            }
            
            // Initialize activity history
            if (!localStorage.getItem(`activity_${user.id}`)) {
                localStorage.setItem(`activity_${user.id}`, JSON.stringify([]));
            }
            
            // Initialize user preferences
            if (!localStorage.getItem(`preferences_${user.id}`)) {
                localStorage.setItem(`preferences_${user.id}`, JSON.stringify({
                    emailNotifications: user.notifications || {},
                    theme: 'light',
                    language: 'en',
                    visibility: 'public'
                }));
            }
            
            // Initialize bookmarks
            if (!localStorage.getItem(`bookmarks_${user.id}`)) {
                localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify([]));
            }
        });
    },
    
    // Get user profile data
    getUserProfile(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === userId);
        
        if (!user) return null;
        
        return {
            ...user,
            achievements: JSON.parse(localStorage.getItem(`achievements_${userId}`) || '[]'),
            activity: JSON.parse(localStorage.getItem(`activity_${userId}`) || '[]'),
            preferences: JSON.parse(localStorage.getItem(`preferences_${userId}`) || '{}'),
            bookmarks: JSON.parse(localStorage.getItem(`bookmarks_${userId}`) || '[]')
        };
    },
    
    // Update user profile data
    updateUserProfile(userId, profileData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;
        
        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            ...profileData
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    },
    
    // Add new achievement
    addAchievement(userId, achievement) {
        const achievements = JSON.parse(localStorage.getItem(`achievements_${userId}`) || '[]');
        achievements.push({
            ...achievement,
            date: new Date().toISOString()
        });
        localStorage.setItem(`achievements_${userId}`, JSON.stringify(achievements));
    },
    
    // Add activity record
    addActivity(userId, activity) {
        const activities = JSON.parse(localStorage.getItem(`activity_${userId}`) || '[]');
        activities.push({
            ...activity,
            date: new Date().toISOString()
        });
        localStorage.setItem(`activity_${userId}`, JSON.stringify(activities));
    },
    
    // Update user preferences
    updatePreferences(userId, preferences) {
        const currentPreferences = JSON.parse(localStorage.getItem(`preferences_${userId}`) || '{}');
        const updatedPreferences = {
            ...currentPreferences,
            ...preferences
        };
        localStorage.setItem(`preferences_${userId}`, JSON.stringify(updatedPreferences));
    }
};

// Initialize profile data when the script loads
document.addEventListener('DOMContentLoaded', () => {
    PROFILE_DATA.initializeFromDb();
});