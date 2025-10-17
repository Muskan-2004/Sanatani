
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                };
                
                // Use the same endpoint as your working form
                const response = await fetch('/api/form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Error: ' + (result.message || 'Failed to send message'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Network error. Please try again.');
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});

// Email Validation Function
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// Temple gallery click handler
document.querySelectorAll('.temple-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('temple-link')) {
            const templeName = card.querySelector('h3').textContent;
            // You can implement more functionality here, like showing a modal
            console.log(`Clicked on ${templeName}`);
        }
    });
});





// form.js - Client-side JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                };
                
                const response = await fetch('/api/form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Error sending message: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Network error. Please try again.');
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
// Favorite Functionality - ADD THIS TO YOUR EXISTING JAVASCRIPT
document.addEventListener('DOMContentLoaded', function() {
    // Add favorite buttons to existing temple cards
    document.querySelectorAll('.temple-card').forEach(card => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        
        // Get temple name from the card
        const templeName = card.querySelector('h3').textContent;
        favoriteBtn.setAttribute('data-temple', templeName);
        
        card.appendChild(favoriteBtn);
        
        // Add click event
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-heart"></i>';
                addToFavorites(templeName);
            } else {
                this.innerHTML = '<i class="far fa-heart"></i>';
                removeFromFavorites(templeName);
            }
        });
    });
    
    // Load existing favorites
    loadFavorites();
});

function addToFavorites(templeName) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(templeName)) {
        favorites.push(templeName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    console.log(`Added ${templeName} to favorites`);
}

function removeFromFavorites(templeName) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(name => name !== templeName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log(`Removed ${templeName} from favorites`);
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const templeName = btn.getAttribute('data-temple');
        if (favorites.includes(templeName)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });
}