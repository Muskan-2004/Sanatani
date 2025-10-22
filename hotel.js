// Global variable to store hotels data
let hotels = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load hotels data from JSON file
    loadHotelsData();
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Load hotels data from JSON file
function loadHotelsData() {
    fetch('config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            hotels = data.hotels;
            // Initialize date pickers
            initDatePickers();
            // Render hotel listings
            renderHotels(hotels);
            // Initialize gallery slider
            initGallerySlider();
            // Initialize FAQ accordion
            initFAQAccordion();
        })
        .catch(error => {
            console.error('Error loading hotels data:', error);
            // Fallback to empty array if JSON fails to load
            hotels = [];
            renderHotels(hotels);
        });
}

function initDatePickers() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    checkinInput.min = formatDate(today);
    checkinInput.value = formatDate(tomorrow);
    
    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 2);
    checkoutInput.min = formatDate(tomorrow);
    checkoutInput.value = formatDate(nextDay);
    
    // Update checkout min date when checkin changes
    checkinInput.addEventListener('change', function() {
        const checkoutDate = new Date(this.value);
        checkoutDate.setDate(checkoutDate.getDate() + 1);
        checkoutInput.min = this.value;
        
        if (new Date(checkoutInput.value) < new Date(this.value)) {
            checkoutInput.value = formatDate(checkoutDate);
        }
    });
}

function renderHotels(hotelsToRender) {
    const hotelsGrid = document.getElementById('hotelsGrid');
    hotelsGrid.innerHTML = '';
    
    if (hotelsToRender.length === 0) {
        hotelsGrid.innerHTML = '<p class="no-hotels">No hotels match your filters. Please try different criteria.</p>';
        return;
    }
    
    hotelsToRender.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.className = 'hotel-card';
        hotelCard.setAttribute('data-aos', 'fade-up');
        
        hotelCard.innerHTML = `
            <div class="hotel-image">
                <img src="${hotel.image}" alt="${hotel.name}">
                <div class="hotel-category-tag">${getCategoryLabel(hotel.category)}</div>
            </div>
            <div class="hotel-info">
                <h3 class="hotel-name">${hotel.name}</h3>
                <p class="hotel-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${hotel.location} • ${hotel.nearby}
                </p>
                <div class="hotel-rating">
                    ${renderRatingStars(hotel.rating)}
                    <span>${hotel.rating}</span>
                </div>
                <p class="hotel-price">₹${hotel.price.toLocaleString('en-IN')} <span>per ${hotel.per}</span></p>
                <div class="hotel-amenities">
                    ${hotel.amenities.map(amenity => `
                        <span class="amenity">
                            <i class="fas fa-check"></i> ${amenity}
                        </span>
                    `).join('')}
                </div>
                <button class="book-now-btn" data-hotel-id="${hotel.id}">
                    Book Now
                </button>
            </div>
        `;
        
        hotelsGrid.appendChild(hotelCard);
    });
    
    // Refresh AOS for new elements
    AOS.refresh();
}

function getCategoryLabel(category) {
    const labels = {
        'budget': 'Budget',
        'standard': 'Standard',
        'premium': 'Premium',
        'luxury': 'Luxury',
        'dharamshala': 'Dharamshala',
        'boutique': 'Boutique',
        'heritage': 'Heritage'
    };
    return labels[category] || category;
}

function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHtml = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    
    return starsHtml;
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Temple search functionality
    const templeSearch = document.getElementById('templeSearch');
    templeSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const templeOptions = document.querySelectorAll('.temple-option');
        
        templeOptions.forEach(option => {
            const label = option.querySelector('label').textContent.toLowerCase();
            option.style.display = label.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFilters');
    applyFiltersBtn.addEventListener('click', applyHotelFilters);

    // Reset filters button
    const resetFiltersBtn = document.getElementById('resetFilters');
    resetFiltersBtn.addEventListener('click', resetHotelFilters);

    // Pilgrimage form submission
    const pilgrimageForm = document.getElementById('pilgrimageForm');
    pilgrimageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get selected temples
        const selectedTemples = Array.from(document.querySelectorAll('.temple-option input:checked'))
            .map(checkbox => checkbox.value);
        
        if (selectedTemples.length === 0) {
            alert('Please select at least one temple to visit');
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            checkin: document.getElementById('checkin').value,
            checkout: document.getElementById('checkout').value,
            guests: document.getElementById('guests').value,
            hotelCategory: document.getElementById('hotel').value,
            transport: document.getElementById('transport').value,
            temples: selectedTemples
        };
        
        // In a real app, you would send this to your backend
        console.log('Pilgrimage booking request:', formData);
        showBookingConfirmation(formData);
        
        // Reset form
        this.reset();
        document.querySelectorAll('.temple-option input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Re-initialize dates
        initDatePickers();
    });

    // Book Now buttons (delegated event)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('book-now-btn')) {
            e.preventDefault();
            const hotelId = e.target.getAttribute('data-hotel-id');
            const hotel = hotels.find(h => h.id == hotelId);
            
            if (hotel) {
                alert(`You are booking: ${hotel.name}\nPrice: ₹${hotel.price.toLocaleString('en-IN')} per ${hotel.per}\n\nPlease fill out the pilgrimage form above to complete your booking.`);
                // Scroll to booking form
                document.querySelector('#book').scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

function applyHotelFilters() {
    const city = document.getElementById('cityFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || 20000;
    const minRating = parseFloat(document.getElementById('ratingFilter').value) || 0;
    
    // Get selected amenities
    const selectedAmenities = [];
    document.querySelectorAll('.amenity-checkbox input:checked').forEach(checkbox => {
        selectedAmenities.push(checkbox.value);
    });
    
    let filteredHotels = hotels;
    
    // Filter by city
    if (city !== 'all') {
        filteredHotels = filteredHotels.filter(hotel => 
            hotel.location.toLowerCase().includes(city)
        );
    }
    
    // Filter by category
    if (category !== 'all') {
        filteredHotels = filteredHotels.filter(hotel => 
            hotel.category === category
        );
    }
    
    // Filter by price range
    filteredHotels = filteredHotels.filter(hotel => 
        hotel.price >= minPrice && hotel.price <= maxPrice
    );
    
    // Filter by rating
    filteredHotels = filteredHotels.filter(hotel => 
        hotel.rating >= minRating
    );
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
        filteredHotels = filteredHotels.filter(hotel => {
            return selectedAmenities.every(amenity => 
                hotel.amenities.some(hotelAmenity => 
                    hotelAmenity.toLowerCase().includes(amenity)
                )
            );
        });
    }
    
    renderHotels(filteredHotels);
}

function resetHotelFilters() {
    document.getElementById('cityFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('minPrice').value = '0';
    document.getElementById('maxPrice').value = '20000';
    document.getElementById('ratingFilter').value = '0';
    
    document.querySelectorAll('.amenity-checkbox input').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    renderHotels(hotels);
}

function showBookingConfirmation(formData) {
    const templeList = formData.temples.map(temple => `• ${temple}`).join('\n');
    
    const confirmationMessage = `Thank you for your pilgrimage request, ${formData.name}!
            
Your booking details:
------------------------------
Temples to visit:
${templeList}

Travel Dates: ${formData.checkin} to ${formData.checkout}
Number of Pilgrims: ${formData.guests}
Hotel Preference: ${getCategoryLabel(formData.hotelCategory)}
Transport: ${formData.transport}

We'll contact you shortly at ${formData.email} or ${formData.phone} to confirm your booking.`;

    alert(confirmationMessage);
}

function initGallerySlider() {
    const track = document.getElementById('galleryTrack');
    const dots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    
    function goToSlide(slideIndex) {
        track.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[slideIndex].classList.add('active');
        
        currentSlide = slideIndex;
    }
    
    // Add click events to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });
    
    // Add click events to arrows
    prevBtn.addEventListener('click', function() {
        let prevSlide = currentSlide - 1;
        if (prevSlide < 0) prevSlide = dots.length - 1;
        goToSlide(prevSlide);
    });
    
    nextBtn.addEventListener('click', function() {
        let nextSlide = currentSlide + 1;
        if (nextSlide >= dots.length) nextSlide = 0;
        goToSlide(nextSlide);
    });
    
    // Auto slide every 5 seconds
    setInterval(() => {
        let nextSlide = currentSlide + 1;
        if (nextSlide >= dots.length) nextSlide = 0;
        goToSlide(nextSlide);
    }, 5000);
}

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}