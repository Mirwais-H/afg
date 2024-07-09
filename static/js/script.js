document.addEventListener('DOMContentLoaded', function() {
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const signupLink = document.getElementById('signup-link');

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(event) {
      event.preventDefault();
      openForgotPassword();
    });
  }

  if (signupLink) {
    signupLink.addEventListener('click', function(event) {
      event.preventDefault();
      openSignupPage();
    });
  }
});

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    if (sidebar.style.left === '0px') {
      sidebar.style.left = '-250px';
    } else {
      sidebar.style.left = '0px';
    }
  }
}

function openLoginPage() {
  window.location.href = 'login.html';
}

function openSignupPage() {
  window.location.href = 'signup.html';
}

function openProfilePage() {
  window.location.href = 'profile.html';
}

function returnHome() {
  window.location.href = 'index.html';
}

function handleSignup(event) {
  event.preventDefault();
  const form = document.getElementById('signup-form');
  const formData = new FormData(form);
  
  fetch('/api/signup', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = 'index.html';
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function handleLogin(event) {
  event.preventDefault();
  const form = document.getElementById('login-form');
  const formData = new FormData(form);
  
  fetch('/api/login', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = 'index.html';
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}



// Backend Node.js with Express

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

const users = []; // For simplicity, using an array. Use a database in production.

app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.json({ success: false, message: 'Passwords do not match' });
  }

  const user = {
    firstName,
    lastName,
    email,
    username,
    password,
    profileImage: `https://ui-avatars.com/api/?name=${firstName.charAt(0)}`
  };

  users.push(user);

  req.session.user = user;
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.json({ success: false, message: 'Invalid username or password' });
  }

  req.session.user = user;
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
