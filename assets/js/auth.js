// Authentication Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const form = this;
            const submitBtn = form.querySelector('button[type="submit"]');
            const email = form.email.value.trim();
            const password = form.password.value;
            const remember = form.remember.checked;
            
            // Validate inputs
            if (!email || !password) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate loading state
            form.classList.add('is-loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Check if user exists in localStorage
                const users = JSON.parse(localStorage.getItem('cryptoFlashUsers')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // In a real app, you would:
                    // 1. Get a token from your backend
                    // 2. Store the token securely
                    // 3. Redirect to dashboard
                    
                    // For demo purposes, we'll just store the user in sessionStorage
                    sessionStorage.setItem('cryptoFlashCurrentUser', JSON.stringify(user));
                    
                    // If "Remember me" is checked, store in localStorage
                    if (remember) {
                        localStorage.setItem('cryptoFlashRememberedUser', email);
                    } else {
                        localStorage.removeItem('cryptoFlashRememberedUser');
                    }
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    showAlert('Invalid email or password', 'error');
                    form.classList.remove('is-loading');
                    submitBtn.disabled = false;
                }
            }, 1500);
        });
    }
    
    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const form = this;
            const submitBtn = form.querySelector('button[type="submit"]');
            const fullName = form.fullName.value.trim();
            const email = form.email.value.trim();
            const password = form.password.value;
            const confirmPassword = form.confirmPassword.value;
            const terms = form.terms.checked;
            
            // Validate inputs
            if (!fullName || !email || !password || !confirmPassword) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            if (!terms) {
                showAlert('You must agree to the terms and conditions', 'error');
                return;
            }
            
            // Check password strength
            if (password.length < 8) {
                showAlert('Password must be at least 8 characters long', 'error');
                return;
            }
            
            // Simulate loading state
            form.classList.add('is-loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Check if user already exists
                const users = JSON.parse(localStorage.getItem('cryptoFlashUsers')) || [];
                
                if (users.some(u => u.email === email)) {
                    showAlert('Email already registered', 'error');
                    form.classList.remove('is-loading');
                    submitBtn.disabled = false;
                    return;
                }
                
                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    fullName,
                    email,
                    password, // In a real app, you would hash the password
                    createdAt: new Date().toISOString(),
                    balance: 0,
                    btc: 0,
                    eth: 0,
                    transactions: []
                };
                
                users.push(newUser);
                localStorage.setItem('cryptoFlashUsers', JSON.stringify(users));
                
                // Store the new user in session
                sessionStorage.setItem('cryptoFlashCurrentUser', JSON.stringify(newUser));
                
                showAlert('Registration successful! Redirecting...', 'success');
                
                // Redirect to dashboard after a delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }, 1500);
        });
    }
    
    // Check for remembered user
    if (loginForm) {
        const rememberedUser = localStorage.getItem('cryptoFlashRememberedUser');
        if (rememberedUser) {
            loginForm.email.value = rememberedUser;
            loginForm.remember.checked = true;
        }
    }
});

// Show alert message
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert-message alert-${type}`;
    alert.textContent = message;
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Position the alert
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        alert.style.top = `${authCard.offsetTop - 60}px`;
    } else {
        alert.style.top = '20px';
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginForm = document.getElementById('loginForm');
  const togglePassword = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.getElementById('remember');
  
  // Toggle password visibility
  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });
  
  // Check for remembered credentials
  if (localStorage.getItem('rememberedEmail')) {
    document.getElementById('email').value = localStorage.getItem('rememberedEmail');
    rememberCheckbox.checked = true;
  }
  
  // Form submission
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = rememberCheckbox.checked;
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
      // Simulate API call (replace with actual fetch)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate credentials (in a real app, this would be server-side)
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      // Remember email if checkbox is checked
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Show success message
      showAlert('Login successful! Redirecting...', 'success');
      
      // Redirect to dashboard (replace with your actual redirect)
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
      
    } catch (error) {
      // Show error message
      showAlert(error.message || 'Login failed. Please try again.', 'error');
      
      // Reset loading state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
  
  // Google login button
  document.querySelector('.auth-social').addEventListener('click', function() {
    showAlert('Google login would be implemented here', 'info');
  });
  
  // Show alert function
  function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.auth-alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `auth-alert auth-alert-${type}`;
    alert.textContent = message;
    
    // Add to DOM
    loginForm.prepend(alert);
    
    // Remove after 5 seconds
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }
});

// Add alert styles to the head
const style = document.createElement('style');
style.textContent = `
    .alert-message {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
    }
    
    .alert-error {
        background-color: var(--danger);
    }
    
    .alert-success {
        background-color: var(--success);
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
`;
document.head.appendChild(style);