// Analytics Dashboard Manager
class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.currentPeriod = 'month'; // week, month, quarter, year
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAnalyticsData();
        this.renderKPIs();
        this.renderCharts();
        this.renderProgressDistribution();
        this.renderTopCourses();
        this.renderCompletionTimeline();
        this.renderHeatmap();
    }

    setupEventListeners() {
        // Date range selector
        document.querySelectorAll('.date-range-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.date-range-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.updateAnalytics();
            });
        });

        // Custom date range
        document.getElementById('applyCustomRange').addEventListener('click', () => {
            const start = document.getElementById('dateStart').value;
            const end = document.getElementById('dateEnd').value;
            if (start && end) {
                this.currentPeriod = 'custom';
                this.updateAnalytics();
            }
        });

        // Chart type selectors
        document.querySelectorAll('.chart-type-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const chartId = e.target.dataset.chart;
                const chartType = e.target.value;
                this.updateChartType(chartId, chartType);
            });
        });
    }

    loadAnalyticsData() {
        // Simulated analytics data
        this.analyticsData = {
            kpis: {
                totalEnrollments: 156,
                enrollmentChange: '+12%',
                completionRate: 78,
                completionChange: '+5%',
                avgProgress: 65,
                progressChange: '+8%',
                satisfactionScore: 4.2,
                satisfactionChange: '+3%'
            },
            
            enrollmentTrend: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'New Enrollments',
                        data: [45, 52, 48, 65, 72, 68],
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)'
                    },
                    {
                        label: 'Completed',
                        data: [32, 38, 42, 48, 52, 58],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)'
                    }
                ]
            },
            
            coursePerformance: {
                labels: ['Python', 'Web Dev', 'Data Science', 'ML', 'Cloud'],
                datasets: [
                    {
                        label: 'Enrollment',
                        data: [45, 32, 28, 22, 18],
                        backgroundColor: [
                            '#4F46E5',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6'
                        ]
                    }
                ]
            },
            
            progressDistribution: {
                beginner: 42,
                intermediate: 35,
                advanced: 23
            },
            
            topCourses: [
                { name: 'Python Fundamentals', enrolled: 45, rating: 4.8, rank: 1 },
                { name: 'Web Development', enrolled: 32, rating: 4.7, rank: 2 },
                { name: 'Data Science', enrolled: 28, rating: 4.6, rank: 3 },
                { name: 'Machine Learning', enrolled: 22, rating: 4.5, rank: 4 },
                { name: 'Cloud Computing', enrolled: 18, rating: 4.4, rank: 5 }
            ],
            
            completionTimeline: [
                { date: '2024-03-15', course: 'Python Fundamentals', user: 'John Smith' },
                { date: '2024-03-14', course: 'Data Science', user: 'Sarah Johnson' },
                { date: '2024-03-12', course: 'Web Development', user: 'Michael Chen' },
                { date: '2024-03-10', course: 'Python Fundamentals', user: 'Emma Wilson' },
                { date: '2024-03-08', course: 'Machine Learning', user: 'David Brown' }
            ],
            
            comparativeMetrics: {
                avgCompletionTime: '4.2 weeks',
                completionTrend: '+',
                avgScore: 86,
                scoreTrend: '+',
                dropoutRate: '12%',
                dropoutTrend: '-',
                engagementRate: '78%',
                engagementTrend: '+'
            },
            
            performanceMatrix: {
                efficiency: { value: 82, trend: '+' },
                engagement: { value: 76, trend: '+' },
                retention: { value: 89, trend: '+' },
                satisfaction: { value: 4.2, trend: '+' }
            },
            
            activityHeatmap: this.generateHeatmapData()
        };
    }

    generateHeatmapData() {
        const days = [];
        for (let i = 0; i < 30; i++) {
            const activity = Math.floor(Math.random() * 4); // 0-3
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            
            days.push({
                date: date.toISOString().split('T')[0],
                activity: activity,
                count: [10, 25, 45, 70][activity]
            });
        }
        return days;
    }

    renderKPIs() {
        const kpis = this.analyticsData.kpis;
        
        // Update KPI values
        document.querySelectorAll('.kpi-value').forEach(el => {
            const type = el.closest('.kpi-card').classList[1];
            switch(type) {
                case 'enrollments':
                    el.textContent = kpis.totalEnrollments;
                    break;
                case 'completion':
                    el.textContent = `${kpis.completionRate}%`;
                    break;
                case 'progress':
                    el.textContent = `${kpis.avgProgress}%`;
                    break;
                case 'satisfaction':
                    el.textContent = kpis.satisfactionScore;
                    break;
            }
        });

        // Update KPI changes
        document.querySelectorAll('.kpi-change').forEach(el => {
            const type = el.closest('.kpi-card').classList[1];
            let change, isPositive;
            
            switch(type) {
                case 'enrollments':
                    change = kpis.enrollmentChange;
                    isPositive = change.startsWith('+');
                    break;
                case 'completion':
                    change = kpis.completionChange;
                    isPositive = change.startsWith('+');
                    break;
                case 'progress':
                    change = kpis.progressChange;
                    isPositive = change.startsWith('+');
                    break;
                case 'satisfaction':
                    change = kpis.satisfactionChange;
                    isPositive = change.startsWith('+');
                    break;
            }
            
            el.textContent = change;
            el.className = `kpi-change ${isPositive ? 'positive' : 'negative'}`;
            el.innerHTML = isPositive ? 
                `<i class="fas fa-arrow-up"></i> ${change}` :
                `<i class="fas fa-arrow-down"></i> ${change}`;
        });
    }

    renderCharts() {
        // Enrollment Trend Chart
        this.renderEnrollmentChart();
        
        // Course Performance Chart
        this.renderCoursePerformanceChart();
        
        // Performance Matrix
        this.renderPerformanceMatrix();
        
        // Comparative Metrics
        this.renderComparativeMetrics();
    }

    renderEnrollmentChart() {
        const ctx = document.getElementById('enrollmentChart').getContext('2d');
        
        if (this.charts.enrollment) {
            this.charts.enrollment.destroy();
        }
        
        this.charts.enrollment = new Chart(ctx, {
            type: 'line',
            data: this.analyticsData.enrollmentTrend,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: "'Inter', sans-serif"
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    renderCoursePerformanceChart() {
        const ctx = document.getElementById('courseChart').getContext('2d');
        
        if (this.charts.course) {
            this.charts.course.destroy();
        }
        
        this.charts.course = new Chart(ctx, {
            type: 'bar',
            data: this.analyticsData.coursePerformance,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    renderProgressDistribution() {
        const distribution = this.analyticsData.progressDistribution;
        
        // Update counts
        document.getElementById('beginnerCount').textContent = distribution.beginner;
        document.getElementById('intermediateCount').textContent = distribution.intermediate;
        document.getElementById('advancedCount').textContent = distribution.advanced;
        
        // Calculate percentages
        const total = distribution.beginner + distribution.intermediate + distribution.advanced;
        const beginnerPercent = Math.round((distribution.beginner / total) * 100);
        const intermediatePercent = Math.round((distribution.intermediate / total) * 100);
        const advancedPercent = Math.round((distribution.advanced / total) * 100);
        
        // Update percentages
        document.getElementById('beginnerPercent').textContent = `${beginnerPercent}%`;
        document.getElementById('intermediatePercent').textContent = `${intermediatePercent}%`;
        document.getElementById('advancedPercent').textContent = `${advancedPercent}%`;
    }

    renderTopCourses() {
        const container = document.getElementById('topCoursesList');
        container.innerHTML = '';
        
        this.analyticsData.topCourses.forEach(course => {
            const div = document.createElement('div');
            div.className = 'course-ranking-item';
            div.innerHTML = `
                <div class="rank-badge rank-${course.rank}">${course.rank}</div>
                <div class="course-ranking-info">
                    <h4>${course.name}</h4>
                    <div class="course-stats">
                        <span class="stat-enrolled">${course.enrolled} enrolled</span>
                        <span class="stat-rating">${course.rating}/5.0</span>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    renderCompletionTimeline() {
        const container = document.getElementById('completionTimeline');
        container.innerHTML = '';
        
        this.analyticsData.completionTimeline.forEach(item => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            const div = document.createElement('div');
            div.className = 'timeline-item';
            div.innerHTML = `
                <div class="timeline-date">${formattedDate}</div>
                <div class="timeline-content">
                    <h4>${item.course} Completed</h4>
                    <p>${item.user} successfully completed the course</p>
                </div>
            `;
            container.appendChild(div);
        });
    }

    renderComparativeMetrics() {
        const metrics = this.analyticsData.comparativeMetrics;
        
        // Update metrics
        document.getElementById('avgCompletionTime').textContent = metrics.avgCompletionTime;
        document.getElementById('avgScore').textContent = metrics.avgScore;
        document.getElementById('dropoutRate').textContent = metrics.dropoutRate;
        document.getElementById('engagementRate').textContent = metrics.engagementRate;
        
        // Update trends
        this.updateTrendElement('completionTrend', metrics.completionTrend);
        this.updateTrendElement('scoreTrend', metrics.scoreTrend);
        this.updateTrendElement('dropoutTrend', metrics.dropoutTrend);
        this.updateTrendElement('engagementTrend', metrics.engagementTrend);
    }

    renderPerformanceMatrix() {
        const matrix = this.analyticsData.performanceMatrix;
        
        Object.keys(matrix).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.querySelector('.performance-value').textContent = matrix[key].value;
                this.updateTrendElement(`${key}Trend`, matrix[key].trend);
            }
        });
    }

    updateTrendElement(elementId, trend) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.className = `metric-trend trend-${trend === '+' ? 'up' : trend === '-' ? 'down' : 'neutral'}`;
        element.innerHTML = trend === '+' ? 
            `<i class="fas fa-arrow-up"></i>` :
            trend === '-' ? 
            `<i class="fas fa-arrow-down"></i>` :
            `<i class="fas fa-minus"></i>`;
    }

    renderHeatmap() {
        const container = document.getElementById('heatmap');
        container.innerHTML = '';
        
        this.analyticsData.activityHeatmap.forEach(day => {
            const date = new Date(day.date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayOfMonth = date.getDate();
            
            const dayElement = document.createElement('div');
            dayElement.className = `heatmap-day ${this.getActivityLevel(day.activity)}`;
            dayElement.title = `${dayOfWeek}, ${date.toLocaleDateString()}: ${day.count} activities`;
            dayElement.innerHTML = `
                <div class="heatmap-tooltip">
                    ${dayOfWeek}, ${date.toLocaleDateString()}<br>
                    ${day.count} activities
                </div>
            `;
            
            container.appendChild(dayElement);
        });
    }

    getActivityLevel(activity) {
        switch(activity) {
            case 0: return 'low';
            case 1: return 'medium';
            case 2: return 'high';
            case 3: return 'very-high';
            default: return 'low';
        }
    }

    updateChartType(chartId, type) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
        }
        
        // Re-render chart with new type
        if (chartId === 'enrollment') {
            this.renderEnrollmentChart();
        } else if (chartId === 'course') {
            this.renderCoursePerformanceChart();
        }
    }

    updateAnalytics() {
        // Show loading state
        this.showLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            // Reload data based on selected period
            this.loadAnalyticsData();
            this.renderKPIs();
            this.renderCharts();
            this.renderProgressDistribution();
            this.renderTopCourses();
            this.renderCompletionTimeline();
            this.renderHeatmap();
            
            this.showLoading(false);
            
            // Show notification
            this.showNotification(`Analytics updated for ${this.currentPeriod}`, 'success');
        }, 1000);
    }

    showLoading(show) {
        const loader = document.getElementById('analyticsLoader');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Export analytics data
    exportAnalyticsData(format = 'csv') {
        const data = this.analyticsData;
        let content;
        
        switch(format) {
            case 'csv':
                content = this.convertToCSV(data);
                break;
            case 'json':
                content = JSON.stringify(data, null, 2);
                break;
            case 'excel':
                // For Excel, we would typically use a library
                content = this.convertToCSV(data);
                break;
        }
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        this.showNotification(`Analytics exported as ${format.toUpperCase()}`, 'success');
    }

    convertToCSV(data) {
        // Simple CSV conversion for KPIs
        const rows = [];
        rows.push(['Metric', 'Value', 'Change']);
        rows.push(['Total Enrollments', data.kpis.totalEnrollments, data.kpis.enrollmentChange]);
        rows.push(['Completion Rate', `${data.kpis.completionRate}%`, data.kpis.completionChange]);
        rows.push(['Average Progress', `${data.kpis.avgProgress}%`, data.kpis.progressChange]);
        rows.push(['Satisfaction Score', data.kpis.satisfactionScore, data.kpis.satisfactionChange]);
        
        return rows.map(row => row.join(',')).join('\n');
    }
}

// Initialize analytics dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on analytics page
    if (document.getElementById('enrollmentChart')) {
        window.analyticsDashboard = new AnalyticsDashboard();
        
        // Add export buttons functionality
        document.getElementById('exportAnalyticsCSV')?.addEventListener('click', () => {
            analyticsDashboard.exportAnalyticsData