document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('contact-submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };

            // TODO: Replace this URL with your Google Apps Script Web App URL
            // Ensure your Google Apps Script is deployed as a Web App accessible to "Anyone"
            const GOOGLE_API_URL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE";
            
            try {
                if (GOOGLE_API_URL !== "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE") {
                    const response = await fetch(GOOGLE_API_URL, {
                        method: 'POST',
                        body: JSON.stringify(formData),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        mode: 'no-cors' // Use no-cors to prevent CORS issues with simple Google scripts
                    });
                } else {
                    // Simulation for demo purposes since API is not set
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    console.warn("Contact form submitted via mock (Google API URL not set)", formData);
                }
                
                document.getElementById('contact-success').style.display = 'block';
                contactForm.reset();
            } catch (error) {
                alert("There was an error sending your message. Please try again later.");
                console.error("Form submission error", error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide success banner after 5 seconds
                setTimeout(() => {
                    const banner = document.getElementById('contact-success');
                    if (banner) banner.style.display = 'none';
                }, 5000);
            }
        });
    }
});
