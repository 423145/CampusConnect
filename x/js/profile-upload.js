// Profile Image Upload Handler

class ProfileUploadManager {
    constructor() {
        this.avatarInput = document.createElement('input');
        this.coverInput = document.createElement('input');
        this.initializeUploadInputs();
        this.setupEventListeners();
    }

    initializeUploadInputs() {
        // Setup avatar upload input
        this.avatarInput.type = 'file';
        this.avatarInput.accept = 'image/*';
        this.avatarInput.style.display = 'none';
        document.body.appendChild(this.avatarInput);

        // Setup cover upload input
        this.coverInput.type = 'file';
        this.coverInput.accept = 'image/*';
        this.coverInput.style.display = 'none';
        document.body.appendChild(this.coverInput);
    }

    setupEventListeners() {
        // Avatar upload handling
        const editAvatar = document.querySelector('.edit-avatar');
        if (editAvatar) {
            editAvatar.addEventListener('click', () => this.avatarInput.click());
        }

        this.avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file, 'avatar');
            }
        });

        // Cover photo upload handling
        const editCover = document.querySelector('.edit-cover');
        if (editCover) {
            editCover.addEventListener('click', () => this.coverInput.click());
        }

        this.coverInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file, 'cover');
            }
        });
    }

    handleImageUpload(file, type) {
        if (!this.validateImage(file)) {
            alert('Please upload an image file (JPG, PNG, or GIF) under 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            this.saveImageData(imageData, type);
            this.updateImageDisplay(imageData, type);
        };
        reader.readAsDataURL(file);
    }

    validateImage(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        return validTypes.includes(file.type) && file.size <= maxSize;
    }

    saveImageData(imageData, type) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            if (type === 'avatar') {
                users[userIndex].avatar = imageData;
                currentUser.avatar = imageData;
            } else if (type === 'cover') {
                users[userIndex].coverPhoto = imageData;
                currentUser.coverPhoto = imageData;
            }

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Update header avatar if it exists
            if (type === 'avatar') {
                const headerAvatar = document.getElementById('headerAvatar');
                if (headerAvatar) {
                    headerAvatar.src = imageData;
                }
            }
        }
    }

    updateImageDisplay(imageData, type) {
        if (type === 'avatar') {
            const profileAvatar = document.getElementById('profileAvatar');
            if (profileAvatar) {
                profileAvatar.src = imageData;
            }
        } else if (type === 'cover') {
            const coverImage = document.querySelector('.profile-cover img');
            if (coverImage) {
                coverImage.src = imageData;
            }
        }
    }
}

// Initialize profile upload manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileUploadManager();
});