// server.js or your backend file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/crypto_app');

// User schema with login tracking
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Remember to hash this!
  lastLogin: Date,
  loginIp: String,
  loginHistory: [{
    date: Date,
    ip: String,
    device: String
  }]
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());

// Track login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Authenticate user (pseudo-code)
  const user = await User.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }

  // Update login info
  user.lastLogin = new Date();
  user.loginIp = req.ip;
  user.loginHistory.push({
    date: new Date(),
    ip: req.ip,
    device: req.headers['user-agent']
  });
  
  await user.save();
  
  // Return success with token
  res.json({ token: generateToken(user), user });
});

// Get users for admin dashboard
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  const users = await User.find({}, 'username email lastLogin loginIp loginHistory');
  res.json(users);
}); 
// Fetch and display users
async function loadUsers() {
  try {
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    const users = await response.json();
    
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${new Date(user.lastLogin).toLocaleString()}</td>
        <td>${user.loginIp}</td>
        <td>
          <button class="view-history" data-userid="${user._id}">View History</button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Add event listeners to history buttons
    document.querySelectorAll('.view-history').forEach(btn => {
      btn.addEventListener('click', () => showUserHistory(btn.dataset.userid));
    });
    
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

// Show detailed login history
async function showUserHistory(userId) {
  const response = await fetch(`/api/admin/users/${userId}/history`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  const user = await response.json();
  
  document.getElementById('detail-username').textContent = user.username;
  const historyContainer = document.getElementById('login-history-container');
  
  historyContainer.innerHTML = user.loginHistory.map(login => `
    <div class="login-entry">
      <p><strong>Date:</strong> ${new Date(login.date).toLocaleString()}</p>
      <p><strong>IP:</strong> ${login.ip}</p>
      <p><strong>Device:</strong> ${login.device}</p>
      <hr>
    </div>
  `).join('');
  
  document.getElementById('user-detail-modal').style.display = 'block';
}

// Close modal
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('user-detail-modal').style.display = 'none';
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  if (isAdmin()) { // Implement your admin check function
    loadUsers();
    document.getElementById('refresh-users').addEventListener('click', loadUsers);
  }
});y