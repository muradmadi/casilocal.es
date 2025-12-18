// Minimal vanilla JavaScript for mobile menu functionality
// Handles menu toggle and dropdown accordion behavior

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle is handled by inline onclick in HTML
    // This script handles additional interactions if needed
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const header = document.querySelector('.site-header');
        const menu = document.querySelector('.navbar-menu');
        const toggle = document.querySelector('.navbar-toggle');
        
        if (window.innerWidth <= 900) {
            // If menu is open and click is outside header, close it
            if (document.body.classList.contains('menu-open') && 
                !header.contains(event.target)) {
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // Handle dropdown accordion on mobile
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active class on parent nav-item for accordion
            const navItem = this.parentElement;
            const isActive = navItem.classList.contains('active');
            
            // Close other dropdowns
            document.querySelectorAll('.nav-item.active').forEach(item => {
                if (item !== navItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            navItem.classList.toggle('active', !isActive);
            
            // Update aria-expanded
            this.setAttribute('aria-expanded', !isActive);
        });
    });
    
    // Close menu on window resize if switching to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) {
            document.body.classList.remove('menu-open');
            // Reset all dropdown states
            document.querySelectorAll('.nav-item.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});

