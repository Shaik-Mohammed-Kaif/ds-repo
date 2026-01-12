// LIMRA Hotel Management System - Main Application

class HotelApp {
    constructor() {
        this.bookingCart = [];
        this.rooms = [];
        this.services = [];
        this.currentBooking = null;
        
        this.init();
    }
    
    async init() {
        // Initialize AOS
        AOS.init({
            duration: 1000,
            offset: 100,
            once: true
        });
        
        // Initialize Feather Icons
        feather.replace();
        
        // Load data
        await this.loadRooms();
        await this.loadServices();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup navigation
        this.setupNavigation();
        
        // Set minimum dates
        this.setMinimumDates();
    }
    
    async loadRooms() {
        try {
            const response = await fetch('/api/rooms');
            this.rooms = await response.json();
            this.renderRooms();
        } catch (error) {
            console.error('Error loading rooms:', error);
            this.showToast('Failed to load rooms', 'error');
        }
    }
    
    async loadServices() {
        try {
            const response = await fetch('/api/services');
            this.services = await response.json();
            this.renderServices();
        } catch (error) {
            console.error('Error loading services:', error);
            this.showToast('Failed to load services', 'error');
        }
    }
    
    renderRooms() {
        const roomsGrid = document.getElementById('rooms-grid');
        if (!roomsGrid) return;
        
        roomsGrid.innerHTML = this.rooms.map(room => `
            <div class="room-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all" data-aos="fade-up">
                <div class="relative h-64 overflow-hidden">
                    <img src="${room.image}" alt="${room.name}" class="w-full h-full object-cover">
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span class="font-semibold text-primary-600">$${room.price}/night</span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="font-playfair font-bold text-xl text-gray-800 mb-2">${room.name}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${room.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${room.amenities.slice(0, 3).map(amenity => `
                            <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">${amenity}</span>
                        `).join('')}
                    </div>
                    <button onclick="hotelApp.addToBooking(${room.id})" 
                            class="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 btn-primary">
                        <i data-feather="plus" class="w-4 h-4 inline mr-2"></i>
                        Book Now
                    </button>
                </div>
            </div>
        `).join('');
        
        feather.replace();
    }
    
    renderServices() {
        const servicesGrid = document.getElementById('services-grid');
        if (!servicesGrid) return;
        
        servicesGrid.innerHTML = this.services.map(service => `
            <div class="service-card bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all" data-aos="fade-up">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <i data-feather="${this.getServiceIcon(service.category)}" class="w-8 h-8 text-primary-600"></i>
                </div>
                <h3 class="font-playfair font-bold text-xl text-gray-800 mb-2">${service.name}</h3>
                <p class="text-gray-600 mb-4">${service.description}</p>
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-2xl text-primary-600">$${service.price}</span>
                    <button onclick="hotelApp.addServiceToBooking(${service.id})" 
                            class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-all">
                        Add Service
                    </button>
                </div>
            </div>
        `).join('');
        
        feather.replace();
    }
    
    getServiceIcon(category) {
        const icons = {
            food: 'utensils',
            spa: 'heart',
            laundry: 'shirt'
        };
        return icons[category] || 'star';
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
        
        // Booking sidebar toggles
        document.getElementById('booking-toggle')?.addEventListener('click', () => {
            this.toggleBookingSidebar();
        });
        
        document.getElementById('mobile-booking-toggle')?.addEventListener('click', () => {
            this.toggleBookingSidebar();
        });
        
        document.getElementById('close-sidebar')?.addEventListener('click', () => {
            this.closeBookingSidebar();
        });
        
        // Booking form submission
        document.getElementById('confirm-booking')?.addEventListener('click', () => {
            this.confirmBooking();
        });
        
        // Modal close
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Click outside modal to close
        document.getElementById('booking-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'booking-modal') {
                this.closeModal();
            }
        });
        
        // Date inputs change
        document.getElementById('checkin-date')?.addEventListener('change', () => {
            this.updateTotalAmount();
        });
        
        document.getElementById('checkout-date')?.addEventListener('change', () => {
            this.updateTotalAmount();
        });
    }
    
    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Active navigation link highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('bg-white/95', 'backdrop-blur-sm');
            } else {
                navbar.classList.remove('bg-white/95', 'backdrop-blur-sm');
            }
        });
    }
    
    setMinimumDates() {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const checkinDate = document.getElementById('checkin-date');
        const checkoutDate = document.getElementById('checkout-date');
        
        if (checkinDate) {
            checkinDate.min = today;
            checkinDate.value = today;
        }
        
        if (checkoutDate) {
            checkoutDate.min = tomorrow;
            checkoutDate.value = tomorrow;
        }
    }
    
    addToBooking(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;
        
        // Check if room already in cart
        const existingItem = this.bookingCart.find(item => item.id === roomId && item.type === 'room');
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.bookingCart.push({
                id: roomId,
                type: 'room',
                name: room.name,
                price: room.price,
                quantity: 1,
                data: room
            });
        }
        
        this.updateBookingUI();
        this.showToast(`${room.name} added to booking!`, 'success');
    }
    
    addServiceToBooking(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service) return;
        
        // Check if service already in cart
        const existingItem = this.bookingCart.find(item => item.id === serviceId && item.type === 'service');
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.bookingCart.push({
                id: serviceId,
                type: 'service',
                name: service.name,
                price: service.price,
                quantity: 1,
                data: service
            });
        }
        
        this.updateBookingUI();
        this.showToast(`${service.name} added to booking!`, 'success');
    }
    
    removeFromBooking(index) {
        const item = this.bookingCart[index];
        this.bookingCart.splice(index, 1);
        
        this.updateBookingUI();
        this.showToast(`${item.name} removed from booking`, 'info');
    }
    
    updateQuantity(index, change) {
        const item = this.bookingCart[index];
        item.quantity = Math.max(1, item.quantity + change);
        
        this.updateBookingUI();
    }
    
    updateBookingUI() {
        const cartCount = document.getElementById('cart-count');
        const mobileCartCounts = document.querySelectorAll('.cart-count');
        const emptyCart = document.getElementById('empty-cart');
        const bookingItems = document.getElementById('booking-items');
        const bookingForm = document.getElementById('booking-form');
        
        const totalItems = this.bookingCart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart counts
        if (cartCount) cartCount.textContent = totalItems;
        mobileCartCounts.forEach(count => count.textContent = totalItems);
        
        if (this.bookingCart.length === 0) {
            emptyCart?.classList.remove('hidden');
            bookingItems?.classList.add('hidden');
            bookingForm?.classList.add('hidden');
        } else {
            emptyCart?.classList.add('hidden');
            bookingItems?.classList.remove('hidden');
            bookingForm?.classList.remove('hidden');
            
            // Render booking items
            if (bookingItems) {
                bookingItems.innerHTML = this.bookingCart.map((item, index) => `
                    <div class="booking-item bg-gray-50 rounded-lg p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-semibold text-gray-800">${item.name}</h4>
                            <button onclick="hotelApp.removeFromBooking(${index})" 
                                    class="text-red-500 hover:text-red-700 transition-colors">
                                <i data-feather="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <button onclick="hotelApp.updateQuantity(${index}, -1)" 
                                        class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                                    <i data-feather="minus" class="w-3 h-3"></i>
                                </button>
                                <span class="font-medium">${item.quantity}</span>
                                <button onclick="hotelApp.updateQuantity(${index}, 1)" 
                                        class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                                    <i data-feather="plus" class="w-3 h-3"></i>
                                </button>
                            </div>
                            <span class="font-semibold text-primary-600">$${item.price * item.quantity}</span>
                        </div>
                    </div>
                `).join('');
                
                feather.replace();
            }
            
            this.updateTotalAmount();
        }
    }
    
    updateTotalAmount() {
        const totalAmountEl = document.getElementById('total-amount');
        if (!totalAmountEl) return;
        
        const checkinDate = document.getElementById('checkin-date')?.value;
        const checkoutDate = document.getElementById('checkout-date')?.value;
        
        let nights = 1;
        if (checkinDate && checkoutDate) {
            const checkin = new Date(checkinDate);
            const checkout = new Date(checkoutDate);
            const diffTime = checkout - checkin;
            nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }
        
        const roomsTotal = this.bookingCart
            .filter(item => item.type === 'room')
            .reduce((sum, item) => sum + (item.price * item.quantity * nights), 0);
        
        const servicesTotal = this.bookingCart
            .filter(item => item.type === 'service')
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const total = roomsTotal + servicesTotal;
        totalAmountEl.textContent = `$${total}`;
    }
    
    toggleBookingSidebar() {
        const sidebar = document.getElementById('booking-sidebar');
        sidebar.classList.toggle('translate-x-full');
    }
    
    closeBookingSidebar() {
        const sidebar = document.getElementById('booking-sidebar');
        sidebar.classList.add('translate-x-full');
    }
    
    async confirmBooking() {
        // Validate form
        const checkinDate = document.getElementById('checkin-date')?.value;
        const checkoutDate = document.getElementById('checkout-date')?.value;
        const guestCount = document.getElementById('guest-count')?.value;
        const guestEmail = document.getElementById('guest-email')?.value;
        const guestPhone = document.getElementById('guest-phone')?.value;
        
        if (!checkinDate || !checkoutDate || !guestEmail) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        if (this.bookingCart.length === 0) {
            this.showToast('Please add rooms to your booking', 'error');
            return;
        }
        
        const totalAmount = parseFloat(document.getElementById('total-amount')?.textContent.replace('$', ''));
        
        const bookingData = {
            checkinDate,
            checkoutDate,
            guestCount: parseInt(guestCount),
            guestEmail,
            guestPhone,
            items: this.bookingCart,
            totalAmount
        };
        
        try {
            // Show loading
            const confirmBtn = document.getElementById('confirm-booking');
            confirmBtn.innerHTML = '<div class="spinner inline mr-2"></div>Processing...';
            confirmBtn.disabled = true;
            
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentBooking = result.booking;
                this.showBookingConfirmation();
                this.clearBooking();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Booking error:', error);
            this.showToast('Failed to confirm booking. Please try again.', 'error');
        } finally {
            // Reset button
            const confirmBtn = document.getElementById('confirm-booking');
            confirmBtn.innerHTML = 'Confirm Booking';
            confirmBtn.disabled = false;
        }
    }
    
    showBookingConfirmation() {
        const modal = document.getElementById('booking-modal');
        const bookingDetails = document.getElementById('booking-details');
        
        if (this.currentBooking && bookingDetails) {
            const checkin = new Date(this.currentBooking.checkinDate).toLocaleDateString();
            const checkout = new Date(this.currentBooking.checkoutDate).toLocaleDateString();
            
            bookingDetails.innerHTML = `
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="font-medium">Booking ID:</span>
                        <span class="text-gray-600">#${this.currentBooking.id}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Check-in:</span>
                        <span class="text-gray-600">${checkin}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Check-out:</span>
                        <span class="text-gray-600">${checkout}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Guests:</span>
                        <span class="text-gray-600">${this.currentBooking.guestCount}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Total Amount:</span>
                        <span class="font-semibold text-primary-600">$${this.currentBooking.totalAmount}</span>
                    </div>
                </div>
            `;
        }
        
        modal?.classList.remove('hidden');
        setTimeout(() => {
            modal?.classList.add('show');
        }, 10);
    }
    
    closeModal() {
        const modal = document.getElementById('booking-modal');
        modal?.classList.remove('show');
        setTimeout(() => {
            modal?.classList.add('hidden');
        }, 300);
    }
    
    clearBooking() {
        this.bookingCart = [];
        this.updateBookingUI();
        this.closeBookingSidebar();
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type} px-6 py-4 shadow-lg max-w-sm`;
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

// Global functions for onclick handlers
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hotelApp = new HotelApp();
});