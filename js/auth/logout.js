// js/auth/logout.js - Logout logic
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logout-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Clear any session data if using localStorage/sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.href = '../login.html';
    });
  }
});
