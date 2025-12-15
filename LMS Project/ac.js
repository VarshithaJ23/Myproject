// Initialize Assign Course Page
function initAssignCoursePage() {
    const modal = document.getElementById('usersModal');
    const modalUsersList = document.getElementById('modalUsersList');
    const selectedUsers = document.getElementById('selectedUsers');
    const selectUsersBtn = document.getElementById('selectUsersBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelSelection = document.getElementById('cancelSelection');
    const confirmSelection = document.getElementById('confirmSelection');
    const userSearch = document.getElementById('userSearch');
    const modalSearch = document.getElementById('modalSearch');
    
    let allUsers = [
        { id: 1, name: 'John Smith', email: 'john@example.com', avatar: 'JS' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', avatar: 'SJ' },
        { id: 3, name: 'Michael Chen', email: 'michael@example.com', avatar: 'MC' },
        { id: 4, name: 'Emma Wilson', email: 'emma@example.com', avatar: 'EW' },
        { id: 5, name: 'David Brown', email: 'david@example.com', avatar: 'DB' },
        { id: 6, name: 'Lisa Taylor', email: 'lisa@example.com', avatar: 'LT' },
        { id: 7, name: 'Robert Lee', email: 'robert@example.com', avatar: 'RL' },
        { id: 8, name: 'Maria Garcia', email: 'maria@example.com', avatar: 'MG' }
    ];
    
    let selectedUserIds = new Set();
    let filteredUsers = [...allUsers];
    
    // Initialize users list
    renderUsersList();
    renderModalUsersList();
    
    // Open modal
    selectUsersBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    // Close modal
    closeModal.addEventListener('click', closeModalHandler);
    cancelSelection.addEventListener('click', closeModalHandler);
    
    // Confirm selection
    confirmSelection.addEventListener('click', confirmSelectionHandler);
    
    // Search in main users list
    userSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        renderUsersList();
    });
    
    // Search in modal
    modalSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        renderModalUsersList(filtered);
    });
    
    // Form submission
    document.getElementById('assignForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const courseSelect = document.getElementById('selectCourse');
        const selectedCourse = courseSelect.options[courseSelect.selectedIndex].text;
        
        if (selectedUserIds.size === 0) {
            showNotification('Please select at least one user', 'error');
            return;
        }
        
        // Show success message
        showNotification(`Course assigned to ${selectedUserIds.size} users successfully!`, 'success');
        
        // Add to assignments table
        addToAssignmentsTable(selectedCourse);
        
        // Reset form
        this.reset();
        selectedUserIds.clear();
        updateSelectedUsersDisplay();
        
        // Update users list
        allUsers.forEach(user => {
            const checkbox = document.querySelector(`.user-checkbox input[data-id="${user.id}"]`);
            if (checkbox) checkbox.checked = false;
        });
    });
    
    function renderUsersList() {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = filteredUsers.map(user => `
            <div class="user-list-item ${selectedUserIds.has(user.id) ? 'selected' : ''}">
                <img src="https://ui-avatars.com/api/?name=${user.avatar}&background=4F46E5&color=fff" 
                     class="user-avatar" alt="${user.name}">
                <div class="user-details">
                    <h4>${user.name}</h4>
                    <p>${user.email}</p>
                </div>
                <div class="user-checkbox">
                    <input type="checkbox" data-id="${user.id}" 
                           ${selectedUserIds.has(user.id) ? 'checked' : ''}
                           onchange="toggleUserSelection(${user.id}, this.checked)">
                </div>
            </div>
        `).join('');
    }
    
    function renderModalUsersList(users = allUsers) {
        modalUsersList.innerHTML = users.map(user => `
            <div class="modal-user-item ${selectedUserIds.has(user.id) ? 'selected' : ''}" 
                 onclick="toggleModalUserSelection(${user.id})">
                <div class="modal-user-checkbox">
                    <input type="checkbox" data-id="${user.id}" 
                           ${selectedUserIds.has(user.id) ? 'checked' : ''}>
                </div>
                <img src="https://ui-avatars.com/api/?name=${user.avatar}&background=4F46E5&color=fff" 
                     style="width: 40px; height: 40px; border-radius: 50%; margin-right: 15px;" 
                     alt="${user.name}">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; font-size: 15px;">${user.name}</h4>
                    <p style="margin: 0; color: #64748b; font-size: 13px;">${user.email}</p>
                </div>
            </div>
        `).join('');
    }
    
    function closeModalHandler() {
        modal.classList.remove('active');
        modalSearch.value = '';
        renderModalUsersList();
    }
    
    function confirmSelectionHandler() {
        updateSelectedUsersDisplay();
        renderUsersList();
        modal.classList.remove('active');
        modalSearch.value = '';
    }
    
    function updateSelectedUsersDisplay() {
        selectedUsers.innerHTML = '';
        
        if (selectedUserIds.size === 0) {
            selectedUsers.innerHTML = '<span class="placeholder">No users selected</span>';
            return;
        }
        
        allUsers.filter(user => selectedUserIds.has(user.id)).forEach(user => {
            const tag = document.createElement('div');
            tag.className = 'user-tag';
            tag.innerHTML = `
                ${user.name}
                <i class="fas fa-times" onclick="removeUser(${user.id})"></i>
            `;
            selectedUsers.appendChild(tag);
        });
    }
    
    // Add to assignments table
    function addToAssignmentsTable(courseName) {
        const table = document.getElementById('assignmentsTable');
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        allUsers.filter(user => selectedUserIds.has(user.id)).forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${courseName}</td>
                <td>Admin User</td>
                <td>${dateStr} ${timeStr}</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td>
                    <button class="btn-action btn-view" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-remove" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            table.insertBefore(row, table.firstChild);
        });
    }
    
    // Global functions for event handlers
    window.toggleUserSelection = function(userId, isChecked) {
        if (isChecked) {
            selectedUserIds.add(userId);
        } else {
            selectedUserIds.delete(userId);
        }
        renderUsersList();
        updateSelectedUsersDisplay();
    };
    
    window.toggleModalUserSelection = function(userId) {
        if (selectedUserIds.has(userId)) {
            selectedUserIds.delete(userId);
        } else {
            selectedUserIds.add(userId);
        }
        renderModalUsersList();
    };
    
    window.removeUser = function(userId) {
        selectedUserIds.delete(userId);
        updateSelectedUsersDisplay();
        renderUsersList();
        renderModalUsersList();
    };
    
    // Bulk assign button
    document.getElementById('bulkAssignBtn').addEventListener('click', function() {
        // Select all users
        selectedUserIds = new Set(allUsers.map(user => user.id));
        updateSelectedUsersDisplay();
        renderUsersList();
        renderModalUsersList();
        showNotification('All users selected for assignment', 'info');
    });
}

// Initialize Enrollments Page
function initEnrollmentsPage() {
    const enrollmentsData = [
        { id: 1, user: 'John Smith', course: 'Python Fundamentals', date: '2024-03-10', progress: 85, status: 'active', lastActive: '2 hours ago' },
        { id: 2, user: 'Sarah Johnson', course: 'Web Development', date: '2024-03-09', progress: 60, status: 'active', lastActive: 'Yesterday' },
        { id: 3, user: 'Michael Chen', course: 'Data Science', date: '2024-03-08', progress: 92, status: 'completed', lastActive: '3 days ago' },
        { id: 4, user: 'Emma Wilson', course: 'Python Fundamentals', date: '2024-03-07', progress: 45, status: 'active', lastActive: '5 hours ago' },
        { id: 5, user: 'David Brown', course: 'Machine Learning', date: '2024-03-06', progress: 30, status: 'pending', lastActive: '1 week ago' },
        { id: 6, user: 'Lisa Taylor', course: 'Web Development', date: '2024-03-05', progress: 75, status: 'active', lastActive: 'Today' },
        { id: 7, user: 'Robert Lee', course: 'Data Science', date: '2024-03-04', progress: 100, status: 'completed', lastActive: '2 days ago' },
        { id: 8, user: 'Maria Garcia', course: 'Python Fundamentals', date: '2024-03-03', progress: 20, status: 'active', lastActive: '4 hours ago' },
        { id: 9, user: 'Alex Turner', course: 'Machine Learning', date: '2024-03-02', progress: 68, status: 'active', lastActive: 'Yesterday' },
        { id: 10, user: 'Sophia Martinez', course: 'Web Development', date: '2024-03-01', progress: 55, status: 'active', lastActive: 'Today' }
    ];
    
    const enrollmentsTable = document.getElementById('enrollmentsTable').querySelector('tbody');
    const selectAllCheckbox = document.getElementById('selectAll');
    const enrollmentSearch = document.getElementById('enrollmentSearch');
    const filterStatus = document.getElementById('filterStatus');
    const filterCourse = document.getElementById('filterCourse');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');
    
    let filteredEnrollments = [...enrollmentsData];
    
    // Initialize table
    renderEnrollmentsTable();
    
    // Select all checkbox
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = enrollmentsTable.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // Search functionality
    enrollmentSearch.addEventListener('input', function() {
        filterEnrollments();
    });
    
    // Filter functionality
    filterStatus.addEventListener('change', filterEnrollments);
    filterCourse.addEventListener('change', filterEnrollments);
    
    // Refresh button
    refreshBtn.addEventListener('click', function() {
        this.style.animation = 'spin 0.5s ease';
        setTimeout(() => {
            this.style.animation = '';
            filterEnrollments();
            showNotification('Enrollments refreshed', 'success');
        }, 500);
    });
    
    // Export button
    exportBtn.addEventListener('click', exportToCSV);
    
    function renderEnrollmentsTable() {
        enrollmentsTable.innerHTML = filteredEnrollments.map(enrollment => `
            <tr>
                <td><input type="checkbox" data-id="${enrollment.id}"></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="https://ui-avatars.com/api/?name=${enrollment.user.split(' ').map(n => n[0]).join('')}&background=4F46E5&color=fff" 
                             style="width: 40px; height: 40px; border-radius: 50%;">
                        <div>
                            <div style="font-weight: 600;">${enrollment.user}</div>
                            <small style="color: #64748b;">ID: ${enrollment.id}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-weight: 600; color: #4F46E5;">${enrollment.course}</div>
                    <small style="color: #64748b;">Enrolled: ${enrollment.date}</small>
                </td>
                <td>${enrollment.date}</td>
                <td class="progress-cell">
                    <div class="progress-wrapper">
                        <div class="progress-indicator">
                            <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                        </div>
                        <span class="progress-text">${enrollment.progress}%</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${enrollment.status}">
                        ${enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </span>
                </td>
                <td>${enrollment.lastActive}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" title="View Details" onclick="viewEnrollment(${enrollment.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" title="Edit Progress" onclick="editEnrollment(${enrollment.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-remove" title="Remove" onclick="removeEnrollment(${enrollment.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        showingCount.textContent = filteredEnrollments.length;
        totalCount.textContent = enrollmentsData.length;
    }
    
    function filterEnrollments() {
        const searchTerm = enrollmentSearch.value.toLowerCase();
        const statusFilter = filterStatus.value;
        const courseFilter = filterCourse.value;
        
        filteredEnrollments = enrollmentsData.filter(enrollment => {
            // Search filter
            const matchesSearch = enrollment.user.toLowerCase().includes(searchTerm) ||
                                 enrollment.course.toLowerCase().includes(searchTerm);
            
            // Status filter
            const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
            
            // Course filter
            const matchesCourse = courseFilter === 'all' || 
                                 enrollment.course.toLowerCase().includes(courseFilter);
            
            return matchesSearch && matchesStatus && matchesCourse;
        });
        
        renderEnrollmentsTable();
    }
    
    function exportToCSV() {
        const headers = ['User', 'Course', 'Enrollment Date', 'Progress', 'Status', 'Last Active'];
        const csvContent = [
            headers.join(','),
            ...filteredEnrollments.map(e => [
                `"${e.user}"`,
                `"${e.course}"`,
                e.date,
                `${e.progress}%`,
                e.status,
                `"${e.lastActive}"`
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enrollments_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('CSV exported successfully!', 'success');
    }
    
    // Global functions for enrollment actions
    window.viewEnrollment = function(id) {
        const enrollment = enrollmentsData.find(e => e.id === id);
        showNotification(`Viewing ${enrollment.user}'s enrollment in ${enrollment.course}`, 'info');
    };
    
    window.editEnrollment = function(id) {
        const enrollment = enrollmentsData.find(e => e.id === id);
        const newProgress = prompt(`Edit progress for ${enrollment.user} (current: ${enrollment.progress}%):`, enrollment.progress);
        if (newProgress !== null && !isNaN(newProgress)) {
            enrollment.progress = Math.min(100, Math.max(0, parseInt(newProgress)));
            if (enrollment.progress === 100) enrollment.status = 'completed';
            filterEnrollments();
            showNotification('Progress updated successfully!', 'success');
        }
    };
    
    window.removeEnrollment = function(id) {
        if (confirm('Are you sure you want to remove this enrollment?')) {
            const index = enrollmentsData.findIndex(e => e.id === id);
            if (index !== -1) {
                enrollmentsData.splice(index, 1);
                filterEnrollments();
                showNotification('Enrollment removed successfully!', 'success');
            }
        }
    };
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);