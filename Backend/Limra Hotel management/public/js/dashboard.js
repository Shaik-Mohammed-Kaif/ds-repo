// LIMRA Hotel Dashboard JavaScript

class Dashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.bookings = [];
        this.stats = {};
        
        this.init();
    }
    
    async init() {
        // Initialize Feather Icons
        feather.replace();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        await this.loadDashboardData();
        await this.loadBookings();
        
        // Setup auto-refresh
        this.setupAutoRefresh();
    }
    
    setupEventListeners() {
        // Sidebar toggle for mobile
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                if (href && href.startsWith('#')) {
                    this.showSection(href.substring(1));
                }
            });
        });
        
        // Refresh bookings button
        document.getElementById('refresh-bookings')?.addEventListener('click', () => {
            this.loadBookings();
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const toggle = document.getElementById('sidebar-toggle');
            
            if (window.innerWidth < 1024 && sidebar && !sidebar.contains(e.target) && e.target !== toggle) {
                sidebar.classList.remove('open');
            }
        });
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar?.classList.toggle('open');
    }
    
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNav = document.querySelector(`[href="#${sectionId}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
        
        // Load section-specific data
        if (sectionId === 'bookings') {
            this.loadBookings();
        }
    }
    
    async loadDashboardData() {
        try {
            const response = await fetch('/api/dashboard');
            this.stats = await response.json();
            this.updateDashboardStats();
            this.renderRecentBookings();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showToast('Failed to load dashboard data', 'error');
        }
    }
    
    async loadBookings() {
        try {
            const response = await fetch('/api/bookings');
            this.bookings = await response.json();
            this.renderBookingsTable();
        } catch (error) {
            console.error('Error loading bookings:', error);
            this.showToast('Failed to load bookings', 'error');
        }
    }
    
    updateDashboardStats() {
        document.getElementById('total-bookings').textContent = this.stats.totalBookings || 0;
        document.getElementById('rooms-available').textContent = this.stats.roomsAvailable || 0;
        document.getElementById('revenue-today').textContent = `$${this.stats.revenueToday || 0}`;
    }
    
    renderRecentBookings() {
        const container = document.getElementById('recent-bookings');
        if (!container || !this.stats.recentBookings) return;
        
        if (this.stats.recentBookings.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-feather="calendar" class="w-12 h-12 text-gray-300 mx-auto mb-4"></i>
                    <p class="text-gray-500">No recent bookings</p>
                </div>
            `;
        } else {
            container.innerHTML = this.stats.recentBookings.map(booking => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <i data-feather="user" class="w-5 h-5 text-primary-600"></i>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800">${booking.guestEmail}</p>
                            <p class="text-sm text-gray-600">
                                ${new Date(booking.checkinDate).toLocaleDateString()} - 
                                ${new Date(booking.checkoutDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-primary-600">$${booking.totalAmount}</p>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ${booking.status}
                        </span>
                    </div>
                </div>
            `).join('');
        }
        
        feather.replace();
    }
    
    renderBookingsTable() {
        const tbody = document.getElementById('bookings-table');
        if (!tbody) return;
        
        if (this.bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                        <i data-feather="calendar" class="w-12 h-12 mx-auto mb-4 text-gray-300"></i>
                        <p>No bookings found</p>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = this.bookings.map(booking => `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #${booking.id}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div>
                            <div class="text-sm font-medium text-gray-900">${booking.guestEmail}</div>
                            <div class="text-sm text-gray-500">${booking.guestPhone || 'N/A'}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm text-gray-900">
                            ${booking.items ? booking.items.filter(item => item.type === 'room').map(item => 
                                `${item.name} (${item.quantity})`
                            ).join(', ') : 'N/A'}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${new Date(booking.checkinDate).toLocaleDateString()} - 
                        ${new Date(booking.checkoutDate).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        $${booking.totalAmount}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${this.getStatusClasses(booking.status)}">
                            ${booking.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                            <button onclick="dashboard.updateBookingStatus(${booking.id}, 'confirmed')" 
                                    class="text-green-600 hover:text-green-900 transition-colors" 
                                    title="Confirm">
                                <i data-feather="check" class="w-4 h-4"></i>
                            </button>
                            <button onclick="dashboard.updateBookingStatus(${booking.id}, 'cancelled')" 
                                    class="text-red-600 hover:text-red-900 transition-colors" 
                                    title="Cancel">
                                <i data-feather="x" class="w-4 h-4"></i>
                            </button>
                            <button onclick="dashboard.viewBookingDetails(${booking.id})" 
                                    class="text-blue-600 hover:text-blue-900 transition-colors" 
                                    title="View Details">
                                <i data-feather="eye" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
        
        feather.replace();
    }
    
    getStatusClasses(status) {
        const classes = {
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }
    
    async updateBookingStatus(bookingId, status) {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showToast(`Booking ${status} successfully`, 'success');
                await this.loadBookings();
                await this.loadDashboardData();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            this.showToast('Failed to update booking status', 'error');
        }
    }
    
    viewBookingDetails(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;
        
        const details = `
            Booking ID: #${booking.id}
            Guest: ${booking.guestEmail}
            Phone: ${booking.guestPhone || 'N/A'}
            Check-in: ${new Date(booking.checkinDate).toLocaleDateString()}
            Check-out: ${new Date(booking.checkoutDate).toLocaleDateString()}
            Guests: ${booking.guestCount}
            Total Amount: $${booking.totalAmount}
            Status: ${booking.status}
            
            Items:
            ${booking.items ? booking.items.map(item => 
                `- ${item.name} (${item.quantity}x) - $${item.price * item.quantity}`
            ).join('\n') : 'No items'}
        `;
        
        alert(details);
    }
    
    setupAutoRefresh() {
        // Refresh dashboard data every 5 minutes
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.loadDashboardData();
            }
        }, 5 * 60 * 1000);
    }
    
    showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        
        // Create container if it doesn't exist
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-20 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type} px-6 py-4 shadow-lg max-w-sm rounded-lg`;
        
        const bgClasses = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white',
            warning: 'bg-yellow-500 text-white'
        };
        
        toast.className += ` ${bgClasses[type] || bgClasses.info}`;
        
        toast.innerHTML = `
            <div class="flex items-center">
                <i data-feather="${this.getToastIcon(type)}" class="w-5 h-5 mr-3"></i>
                <span class="font-medium">${message}</span>
                <button class="ml-4 hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
                    <i data-feather="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        container.appendChild(toast);
        feather.replace();
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
    
    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            info: 'info',
            warning: 'alert-triangle'
        };
        return icons[type] || 'info';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});