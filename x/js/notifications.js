// Notifications Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Get elements
    const notificationsList = document.getElementById('notificationsList');
    const notificationsEmpty = document.getElementById('notificationsEmpty');
    const markAllReadBtn = document.getElementById('markAllRead');
    const filterItems = document.querySelectorAll('.dropdown-item');
    const saveSettingsBtn = document.getElementById('saveSettings');
    
    // Load notifications
    loadNotifications();
    
    // Load notification settings
    loadNotificationSettings();
    
    // Handle mark all as read
    markAllReadBtn.addEventListener('click', markAllAsRead);
    
    // Handle filter change
    filterItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            filterItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Filter notifications
            const filter = item.dataset.filter;
            filterNotifications(filter);
        });
    });
    
    // Handle save settings
    saveSettingsBtn.addEventListener('click', saveNotificationSettings);
    
    // Function to load notifications
    function loadNotifications() {
        // Get notifications from localStorage
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Filter notifications for current user
        const userNotifications = notifications.filter(notification => notification.userId === currentUser.id);
        
        // Sort notifications by date (newest first)
        userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Check if there are any notifications
        if (userNotifications.length === 0) {
            notificationsList.style.display = 'none';
            notificationsEmpty.style.display = 'block';
            return;
        }
        
        // Show notifications list
        notificationsList.style.display = 'block';
        notificationsEmpty.style.display = 'none';
        
        // Clear notifications list
        notificationsList.innerHTML = '';
        
        // Render notifications
        userNotifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
            notificationItem.dataset.id = notification.id;
            notificationItem.dataset.type = notification.type;
            
            // Set icon based on notification type
            let iconClass = 'fas fa-bell';
            let iconType = '';
            
            switch (notification.type) {
                case 'answer':
                    iconClass = 'fas fa-comment-dots';
                    iconType = 'answer';
                    break;
                case 'comment':
                    iconClass = 'fas fa-comment';
                    iconType = 'comment';
                    break;
                case 'upvote':
                    iconClass = 'fas fa-thumbs-up';
                    iconType = 'upvote';
                    break;
                case 'mention':
                    iconClass = 'fas fa-at';
                    iconType = 'mention';
                    break;
            }
            
            notificationItem.innerHTML = `
                <div class="notification-icon ${iconType}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-text">${notification.content}</p>
                    <div class="notification-meta">
                        <div class="notification-time">
                            <span>${formatTimeAgo(notification.createdAt)}</span>
                            ${notification.read ? '' : '<span class="unread-indicator">•</span>'}
                        </div>
                        <div class="notification-actions">
                            <span class="notification-action mark-read" title="${notification.read ? 'Mark as unread' : 'Mark as read'}">
                                <i class="fas ${notification.read ? 'fa-envelope' : 'fa-envelope-open'}"></i>
                            </span>
                            <span class="notification-action delete" title="Delete">
                                <i class="fas fa-trash"></i>
                            </span>
                        </div>
                    </div>
                </div>
            `;
            
            notificationsList.appendChild(notificationItem);
            
            // Add event listeners to notification actions
            const markReadBtn = notificationItem.querySelector('.mark-read');
            const deleteBtn = notificationItem.querySelector('.delete');
            
            markReadBtn.addEventListener('click', () => {
                toggleReadStatus(notification.id);
            });
            
            deleteBtn.addEventListener('click', () => {
                deleteNotification(notification.id);
            });
            
            // Mark notification as read when clicked
            notificationItem.addEventListener('click', (e) => {
                // Ignore clicks on action buttons
                if (e.target.closest('.notification-action')) {
                    return;
                }
                
                // Mark as read
                if (!notification.read) {
                    markAsRead(notification.id);
                }
                
                // Navigate to the relevant page
                if (notification.link) {
                    window.location.href = notification.link;
                }
            });
        });
    }
    
    // Function to mark all notifications as read
    function markAllAsRead() {
        // Get notifications from localStorage
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Mark all user notifications as read
        const updatedNotifications = notifications.map(notification => {
            if (notification.userId === currentUser.id) {
                return { ...notification, read: true };
            }
            return notification;
        });
        
        // Update localStorage
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        // Reload notifications
        loadNotifications();
    }
    
    // Function to toggle read status of a notification
    function toggleReadStatus(notificationId) {
        // Get notifications from localStorage
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Find notification
        const notificationIndex = notifications.findIndex(n => n.id === notificationId);
        
        if (notificationIndex !== -1) {
            // Toggle read status
            notifications[notificationIndex].read = !notifications[notificationIndex].read;
            
            // Update localStorage
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            // Reload notifications
            loadNotifications();
        }
    }
    
    // Function to mark a notification as read
    function markAsRead(notificationId) {
        // Get notifications from localStorage
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Find notification
        const notificationIndex = notifications.findIndex(n => n.id === notificationId);
        
        if (notificationIndex !== -1) {
            // Mark as read
            notifications[notificationIndex].read = true;
            
            // Update localStorage
            localStorage.setItem('notifications', JSON.stringify(notifications));
            
            // Update UI
            const notificationItem = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
            if (notificationItem) {
                notificationItem.classList.remove('unread');
                
                const unreadIndicator = notificationItem.querySelector('.unread-indicator');
                if (unreadIndicator) {
                    unreadIndicator.remove();
                }
                
                const markReadBtn = notificationItem.querySelector('.mark-read');
                if (markReadBtn) {
                    markReadBtn.title = 'Mark as unread';
                    markReadBtn.querySelector('i').className = 'fas fa-envelope';
                }
            }
        }
    }
    
    // Function to delete a notification
    function deleteNotification(notificationId) {
        // Get notifications from localStorage
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        
        // Remove notification
        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        
        // Update localStorage
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        // Remove notification from UI
        const notificationItem = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.remove();
        }
        
        // Check if there are any notifications left
        if (updatedNotifications.filter(n => n.userId === currentUser.id).length === 0) {
            notificationsList.style.display = 'none';
            notificationsEmpty.style.display = 'block';
        }
    }
    
    // Function to filter notifications
    function filterNotifications(filter) {
        // Get all notification items
        const notificationItems = document.querySelectorAll('.notification-item');
        
        // Show/hide notifications based on filter
        notificationItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'flex';
            } else if (filter === 'unread') {
                item.style.display = item.classList.contains('unread') ? 'flex' : 'none';
            } else {
                item.style.display = item.dataset.type === filter ? 'flex' : 'none';
            }
        });
        
        // Check if there are any visible notifications
        const visibleNotifications = document.querySelectorAll('.notification-item[style="display: flex;"]');
        
        if (visibleNotifications.length === 0) {
            notificationsEmpty.style.display = 'block';
        } else {
            notificationsEmpty.style.display = 'none';
        }
    }
    
    // Function to load notification settings
    function loadNotificationSettings() {
        // Get user settings from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            const user = users[userIndex];
            
            // Set notification settings
            document.getElementById('emailAnswers').checked = user.notifications?.emailAnswers !== false;
            document.getElementById('emailComments').checked = user.notifications?.emailComments !== false;
            document.getElementById('emailUpvotes').checked = user.notifications?.emailUpvotes === true;
            document.getElementById('emailMentions').checked = user.notifications?.emailMentions !== false;
            document.getElementById('pushAll').checked = user.notifications?.pushAll !== false;
        }
    }
    
    // Function to save notification settings
    function saveNotificationSettings() {
        // Get user settings from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            // Get notification settings
            const emailAnswers = document.getElementById('emailAnswers').checked;
            const emailComments = document.getElementById('emailComments').checked;
            const emailUpvotes = document.getElementById('emailUpvotes').checked;
            const emailMentions = document.getElementById('emailMentions').checked;
            const pushAll = document.getElementById('pushAll').checked;
            
            // Update user settings
            users[userIndex].notifications = {
                emailAnswers,
                emailComments,
                emailUpvotes,
                emailMentions,
                pushAll
            };
            
            // Update localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current user
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            
            // Show success message
            alert('Notification settings saved successfully!');
        }
    }
    
    // Helper function to format time ago
    function formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
});