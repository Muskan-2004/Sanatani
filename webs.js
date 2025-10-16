
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
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get Form Values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('formMessage');
    
    // Simple Validation
    if (name === "" || email === "" || message === "") {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "#ff6b6b";
        formMessage.classList.remove("hidden");
        return;
    }
    
    if (!validateEmail(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.style.color = "#ff6b6b";
        formMessage.classList.remove("hidden");
        return;
    }
    
    // Simulate successful form submission
    formMessage.innerHTML = `<i class="fas fa-check-circle" style="color: #06d1ec; margin-right: 10px;"></i> Thank you for your message, ${name}! We will get back to you soon.`;
    formMessage.style.color = "#ffffff";
    formMessage.classList.remove("hidden");
    
    // Clear the form
    document.getElementById('contactForm').reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.classList.add("hidden");
    }, 5000);
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