// js/components/sidebar.js - Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const dashboardShell = document.querySelector('.dashboard-shell');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarToggle && dashboardShell && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      dashboardShell.classList.toggle('sidebar-collapsed');
      sidebar.classList.toggle('sidebar-hidden');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          dashboardShell.classList.add('sidebar-collapsed');
          sidebar.classList.add('sidebar-hidden');
        }
      }
    });
  }
});
