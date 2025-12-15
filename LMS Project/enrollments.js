// Enrollments Data Manager
class EnrollmentsManager {
    constructor() {
        this.enrollments = this.loadEnrollments();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentView = 'table'; // 'table' or 'cards'
        this.filters = {
            search: '',
            status: 'all',
            course: 'all',
            dateFrom: '',
            dateTo: ''
        };
        this.selectedEnrollments = new Set();
        this.init();
    }

    loadEnrollments() {
        // Sample data - in real app, this would come from API
        return [
            { id: 1, userId: 101, userName: 'John Smith', userEmail: 'john@example.com', 
              courseId: 1, courseName: 'Python Fundamentals', enrollmentDate: '2024-03-10', 
              progress: 85, status: 'active', lastActivity: '2024-03-15', dueDate: '2024-04-10',
              startDate: '2024-03-10', completionDate: null, grade: 'A' },
            
            { id: 2, userId: 102, userName: 'Sarah Johnson', userEmail: 'sarah@example.com',
              courseId: 2, courseName: 'Web Development', enrollmentDate: '2024-03-09',
              progress: 60, status: 'active', lastActivity: '2024-03-14', dueDate: '2024-04-09',
              startDate: '2024-03-09', completionDate: null, grade: 'B+' },
            
            { id: 3, userId: 103, userName: 'Michael Chen', userEmail: 'michael@example.com',
              courseId: 3, courseName: 'Data Science', enrollmentDate: '2024-03-08',
              progress: 92, status: 'completed', lastActivity: '2024-03-12', dueDate: '2024-04-08',
              startDate: '2024-03-08', completionDate: '2024-03-12', grade: 'A+' },
            
            { id: 4, userId: 104, userName: 'Emma Wilson', userEmail: 'emma@example.com',
              courseId: 1, courseName: 'Python Fundamentals', enrollmentDate: '2024-03-07',
              progress: 45, status: 'active', lastActivity: '2024-03-13', dueDate: '2024-04-07',
              startDate: '2024-03-07', completionDate: null, grade: 'B' },
            
            { id: 5, userId: 105, userName: 'David Brown', userEmail: 'david@example.com',
              courseId: 4, courseName: 'Machine Learning', enrollmentDate: '2024-03-06',
              progress: 30, status: 'pending', lastActivity: '2024-03-08', dueDate: '2024-04-06',
              startDate: '2024-03-06', completionDate: null, grade: null },
            
            { id: 6, userId: 106, userName: 'Lisa Taylor', userEmail: 'lisa@example.com',
              courseId: 2, courseName: 'Web Development', enrollmentDate: '2024-03-05',
              progress: 75, status: 'active', lastActivity: '2024-03-15', dueDate: '2024-04-05',
              startDate: '2024-03-05', completionDate: null, grade: 'A-' },
            
            { id: 7, userId: 107, userName: 'Robert Lee', userEmail: 'robert@example.com',
              courseId: 3, courseName: 'Data Science', enrollmentDate: '2024-03-04',
              progress: 100, status: 'completed', lastActivity: '2024-03-11', dueDate: '2024-04-04',
              startDate: '2024-03-04', completionDate: '2024-03-11', grade: 'A' },
            
            { id: 8, userId: 108, userName: 'Maria Garcia', userEmail: 'maria@example.com',
              courseId: 1, courseName: 'Python Fundamentals', enrollmentDate: '2024-03-03',
              progress: 20, status: 'active', lastActivity: '2024-03-14', dueDate: '2024-04-03',
              startDate: '2024-03-03', completionDate: null, grade: 'C+' },
            
            { id: 9, userId: 109, userName: 'Alex Turner', userEmail: 'alex@example.com',
              courseId: 4, courseName: 'Machine Learning', enrollmentDate: '2024-03-02',
              progress: 68, status: 'active', lastActivity: '2024-03-13', dueDate: '2024-04-02',
              startDate: '2024-03-02', completionDate: null, grade: 'B+' },
            
            { id: 10, userId: 110, userName: 'Sophia Martinez', userEmail: 'sophia@example.com',
              courseId: 2, courseName: 'Web Development', enrollmentDate: '2024-03-01',
              progress: 55, status: 'active', lastActivity: '2024-03-15', dueDate: '2024-04-01',
              startDate: '2024-03-01', completionDate: null, grade: 'B' }
        ];
    }

    init() {
        this.setupEventListeners();
        this.render();
        this.updateStats();
    }

    setupEventListeners() {
        // Search
        document.getElementById('enrollmentSearch').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.render();
        });

        // Filters
        document.getElementById('filterStatus').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.currentPage = 1;
            this.render();
        });

        document.getElementById('filterCourse').addEventListener('change', (e) => {
            this.filters.course = e.target.value;
            this.currentPage = 1;
            this.render();
        });

        // View toggle
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.render();
            });
        });

        // Select all
        document.getElementById('selectAll').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.enrollment-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
                const id = parseInt(checkbox.dataset.id);
                if (e.target.checked) {
                    this.selectedEnrollments.add(id);
                } else {
                    this.selectedEnrollments.delete(id);
                }
            });
            this.updateBulkActions();
        });

        // Refresh
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.showLoading(true);
            setTimeout(() => {
                this.showLoading(false);
                this.render();
                this.showNotification('Enrollments refreshed', 'success');
            }, 1000);
        });

        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => this.exportData('csv'));
        document.getElementById('exportExcel').addEventListener('click', () => this.exportData('excel'));
        document.getElementById('exportPDF').addEventListener('click', () => this.exportData('pdf'));

        // Bulk actions
        document.getElementById('bulkAssign').addEventListener('click', () => this.bulkAssign());
        document.getElementById('bulkRemove').addEventListener('click', () => this.bulkRemove());
        document.getElementById('bulkMessage').addEventListener('click', () => this.bulkMessage());

        // Pagination
        document.querySelectorAll('.pagination-btn, .pagination-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.classList.contains('pagination-number')) {
                    this.currentPage = parseInt(e.target.textContent);
                } else if (e.target.closest('.pagination-btn')) {
                    const btn = e.target.closest('.pagination-btn');
                    if (btn.querySelector('.fa-chevron-left')) {
                        this.currentPage = Math.max(1, this.currentPage - 1);
                    } else {
                        this.currentPage = Math.min(
                            Math.ceil(this.getFilteredEnrollments().length / this.itemsPerPage),
                            this.currentPage + 1
                        );
                    }
                }
                this.render();
            });
        });
    }

    getFilteredEnrollments() {
        return this.enrollments.filter(enrollment => {
            // Search filter
            const matchesSearch = !this.filters.search || 
                enrollment.userName.toLowerCase().includes(this.filters.search) ||
                enrollment.userEmail.toLowerCase().includes(this.filters.search) ||
                enrollment.courseName.toLowerCase().includes(this.filters.search);

            // Status filter
            const matchesStatus = this.filters.status === 'all' || 
                enrollment.status === this.filters.status;

            // Course filter
            const matchesCourse = this.filters.course === 'all' ||
                enrollment.courseName.toLowerCase().includes(this.filters.course);

            return matchesSearch && matchesStatus && matchesCourse;
        });
    }

    getPaginatedEnrollments() {
        const filtered = this.getFilteredEnrollments();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }

    render() {
        const filteredEnrollments = this.getFilteredEnrollments();
        const paginatedEnrollments = this.getPaginatedEnrollments();
        
        if (this.currentView === 'table') {
            this.renderTableView(paginatedEnrollments);
        } else {
            this.renderCardsView(paginatedEnrollments);
        }
        
        this.updatePagination(filteredEnrollments.length);
        this.updateStats();
    }

    renderTableView(enrollments) {
        const tbody = document.querySelector('#enrollmentsTable tbody');
        tbody.innerHTML = enrollments.map(enrollment => `
            <tr>
                <td>
                    <input type="checkbox" class="enrollment-checkbox" 
                           data-id="${enrollment.id}"
                           ${this.selectedEnrollments.has(enrollment.id) ? 'checked' : ''}
                           onchange="enrollmentsManager.toggleSelection(${enrollment.id})">
                </td>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar-small">
                            ${enrollment.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div class="user-info">
                            <strong>${enrollment.userName}</strong>
                            <small>${enrollment.userEmail}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="course-cell">
                        <strong class="course-name">${enrollment.courseName}</strong>
                        <small>ID: ${enrollment.courseId}</small>
                    </div>
                </td>
                <td>${this.formatDate(enrollment.enrollmentDate)}</td>
                <td>
                    <div class="progress-cell-table">
                        <div class="progress-info-table">
                            <span>${enrollment.progress}%</span>
                            <small>${this.getProgressText(enrollment.progress)}</small>
                        </div>
                        <div class="progress-bar-table">
                            <div class="progress-fill-table" style="width: ${enrollment.progress}%"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${enrollment.status}">
                        ${enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </span>
                </td>
                <td>${this.formatLastActivity(enrollment.lastActivity)}</td>
                <td>
                    <div class="table-actions">
                        <button class="table-btn view" onclick="enrollmentsManager.viewDetails(${enrollment.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="table-btn edit" onclick="enrollmentsManager.editEnrollment(${enrollment.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="table-btn delete" onclick="enrollmentsManager.removeEnrollment(${enrollment.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="table-btn more" onclick="enrollmentsManager.showMoreActions(${enrollment.id})">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderCardsView(enrollments) {
        const cardsContainer = document.getElementById('enrollmentCards');
        if (!cardsContainer) {
            const container = document.createElement('div');
            container.id = 'enrollmentCards';
            container.className = 'enrollment-cards';
            document.querySelector('.card-body').appendChild(container);
        }
        
        cardsContainer.innerHTML = enrollments.map(enrollment => `
            <div class="enrollment-card">
                <div class="enrollment-header">
                    <div class="enrollment-avatar">
                        ${enrollment.userName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="enrollment-user-info">
                        <h4>${enrollment.userName}</h4>
                        <p>${enrollment.userEmail}</p>
                        <small>Enrolled: ${this.formatDate(enrollment.enrollmentDate)}</small>
                    </div>
                    <input type="checkbox" class="enrollment-checkbox-card" 
                           data-id="${enrollment.id}"
                           ${this.selectedEnrollments.has(enrollment.id) ? 'checked' : ''}
                           onchange="enrollmentsManager.toggleSelection(${enrollment.id})">
                </div>
                
                <div class="enrollment-course">
                    <h5>${enrollment.courseName}</h5>
                    <div class="course-meta">
                        <span><i class="fas fa-hashtag"></i> ${enrollment.courseId}</span>
                        <span><i class="fas fa-calendar"></i> Due: ${this.formatDate(enrollment.dueDate)}</span>
                    </div>
                </div>
                
                <div class="enrollment-progress">
                    <div class="progress-info">
                        <span class="progress-label">Progress</span>
                        <span class="progress-value">${enrollment.progress}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${enrollment.progress}%"></div>
                    </div>
                    <small>${this.getProgressText(enrollment.progress)}</small>
                </div>
                
                <div class="enrollment-footer">
                    <span class="enrollment-status status-${enrollment.status}">
                        ${enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </span>
                    <div class="enrollment-actions">
                        <button class="action-btn view" onclick="enrollmentsManager.viewDetails(${enrollment.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="enrollmentsManager.editEnrollment(${enrollment.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="enrollmentsManager.removeEnrollment(${enrollment.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const paginationNumbers = document.querySelector('.pagination-numbers');
        const prevBtn = document.querySelector('.pagination-btn:first-child');
        const nextBtn = document.querySelector('.pagination-btn:last-child');
        
        // Update pagination numbers
        paginationNumbers.innerHTML = '';