// Course Creation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    if (document.getElementById('courseForm')) {
        initCourseForm();
    }
    
    // Initialize enrollment page
    if (document.getElementById('enrollmentsTable')) {
        initEnrollmentsPage();
    }
    
    // Initialize assign course page
    if (document.getElementById('assignForm')) {
        initAssignCoursePage();
    }
});

function initCourseForm() {
    let moduleCount = 0;
    const modulesContainer = document.getElementById('modulesContainer');
    
    // Add first module by default
    addModule();
    
    // Add module button
    document.getElementById('addModuleBtn').addEventListener('click', addModule);
    
    // Preview functionality
    document.getElementById('previewBtn').addEventListener('click', togglePreview);
    document.getElementById('closePreview').addEventListener('click', togglePreview);
    
    // Form submission
    document.getElementById('courseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        showNotification('Course created successfully!', 'success');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
    
    // File upload preview
    const fileUpload = document.querySelector('.file-upload');
    const fileInput = document.getElementById('courseImage');
    
    fileUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    
    function addModule() {
        moduleCount++;
        const moduleHTML = `
            <div class="module-item" data-id="${moduleCount}">
                <div class="module-header">
                    <input type="text" class="module-title" placeholder="Module ${moduleCount} Title" required>
                    <button type="button" class="btn-remove-module" ${moduleCount === 1 ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <textarea class="module-content" placeholder="What will students learn in this module?" rows="3"></textarea>
                <div class="module-meta">
                    <input type="number" class="module-duration" placeholder="Duration (hours)" min="0.5" step="0.5">
                    <input type="file" class="module-file" accept=".pdf,.ppt,.doc,.mp4">
                </div>
            </div>
        `;
        
        modulesContainer.innerHTML += moduleHTML;
        
        // Add remove functionality
        const removeBtn = modulesContainer.lastElementChild.querySelector('.btn-remove-module');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                if (modulesContainer.children.length > 1) {
                    this.closest('.module-item').remove();
                    updateModuleNumbers();
                }
            });
        }
    }
    
    function updateModuleNumbers() {
        const modules = modulesContainer.querySelectorAll('.module-item');
        modules.forEach((module, index) => {
            const input = module.querySelector('.module-title');
            input.placeholder = `Module ${index + 1} Title`;
        });
        moduleCount = modules.length;
    }
    
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const uploadArea = document.querySelector('.upload-area');
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #10b981;"></i>
                <p>${file.name}</p>
                <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            `;
        }
    }
    
    function togglePreview() {
        const previewSidebar = document.getElementById('previewSidebar');
        previewSidebar.classList.toggle('active');
        
        if (previewSidebar.classList.contains('active')) {
            generatePreview();
        }
    }
    
    function generatePreview() {
        const previewContent = document.getElementById('previewContent');
        const title = document.getElementById('courseTitle').value || 'Course Title';
        const category = document.getElementById('courseCategory').value || 'Category';
        const description = document.getElementById('courseDescription').value || 'Course description will appear here...';
        const duration = document.getElementById('courseDuration').value || '0';
        const level = document.getElementById('courseLevel').value || 'beginner';
        
        // Get modules
        const modules = [];
        document.querySelectorAll('.module-item').forEach(module => {
            const title = module.querySelector('.module-title').value || 'Module Title';
            const content = module.querySelector('.module-content').value || 'Module content...';
            const duration = module.querySelector('.module-duration').value || '1';
            modules.push({ title, content, duration });
        });
        
        const previewHTML = `
            <div class="preview-course">
                <h3>${title}</h3>
                <div class="course-meta">
                    <span class="meta-item"><i class="fas fa-tag"></i> ${category}</span>
                    <span class="meta-item"><i class="fas fa-clock"></i> ${duration} hours</span>
                    <span class="meta-item"><i class="fas fa-chart-line"></i> ${level}</span>
                    <span class="meta-item"><i class="fas fa-layer-group"></i> ${modules.length} modules</span>
                </div>
                <p>${description.substring(0, 150)}${description.length > 150 ? '...' : ''}</p>
            </div>
            
            <div class="preview-description">
                <h5>Description</h5>
                <p>${description || 'No description provided.'}</p>
            </div>
            
            <div class="preview-modules">
                <h5>Course Modules (${modules.length})</h5>
                ${modules.map((module, index) => `
                    <div class="preview-module-item">
                        <h6>Module ${index + 1}: ${module.title}</h6>
                        <p>${module.content.substring(0, 100)}${module.content.length > 100 ? '...' : ''}</p>
                        <small><i class="fas fa-clock"></i> ${module.duration} hours</small>
                    </div>
                `).join('')}
            </div>
        `;
        
        previewContent.innerHTML = previewHTML;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}