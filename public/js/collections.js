// Collections Page Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // FILTER FUNCTIONALITY (Eat & Drink & City Life)
    // ============================================
    
    const filterButtons = document.querySelectorAll('.filter-button');
    const filterableItems = document.querySelectorAll('.featured-place-card, .timeline-event');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            filterableItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('filtered-out');
                    item.classList.add('filter-fade-in');
                } else {
                    item.classList.add('filter-fade-out');
                    setTimeout(() => {
                        item.classList.add('filtered-out');
                        item.classList.remove('filter-fade-out');
                    }, 300);
                }
            });
        });
    });
    
    // ============================================
    // ACCORDION FUNCTIONALITY (Survival)
    // ============================================
    
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionSection = this.parentElement;
            const isActive = accordionSection.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.accordion-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
                accordionSection.classList.add('active');
            }
        });
    });
    
    // ============================================
    // CHECKLIST FUNCTIONALITY (Survival)
    // ============================================
    
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const storageKey = 'casilocal-survival-checklist';
    
    // Load saved checklist state
    function loadChecklistState() {
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
            try {
                const checkedItems = JSON.parse(savedState);
                checklistItems.forEach((checkbox, index) => {
                    if (checkedItems[index]) {
                        checkbox.checked = true;
                    }
                });
            } catch (e) {
                console.error('Error loading checklist state:', e);
            }
        }
    }
    
    // Save checklist state
    function saveChecklistState() {
        const checkedItems = Array.from(checklistItems).map(checkbox => checkbox.checked);
        try {
            localStorage.setItem(storageKey, JSON.stringify(checkedItems));
        } catch (e) {
            console.error('Error saving checklist state:', e);
        }
    }
    
    // Load state on page load
    loadChecklistState();
    
    // Save state on checkbox change
    checklistItems.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveChecklistState();
        });
    });
    
    // ============================================
    // TIMELINE SCROLL (City Life)
    // ============================================
    
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        // Smooth scroll to today's events or first event
        const firstEvent = timelineContainer.querySelector('.timeline-event:not(.filtered-out)');
        if (firstEvent && window.innerWidth > 768) {
            // Scroll to first visible event on load
            setTimeout(() => {
                firstEvent.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }
    
    // ============================================
    // INITIALIZE FILTERS
    // ============================================
    
    // Set "All" filter as active by default if no filter is active
    const activeFilter = document.querySelector('.filter-button.active');
    if (!activeFilter && filterButtons.length > 0) {
        const allFilter = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
        if (allFilter) {
            allFilter.classList.add('active');
        }
    }
});

