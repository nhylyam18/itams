// js/auth/role-utils.js - Role-based access control utilities

/**
 * Get the current user's role from Supabase user metadata
 * @returns {Promise<string|null>} The user's role or null if not found
 */
async function getUserRole() {
  try {
    const { data: { user }, error } = await window.supabaseClient.auth.getUser();
    
    if (error || !user) {
      console.error('Error getting user:', error);
      return null;
    }

    // Get role from user metadata
    const role = user.user_metadata?.role || user.user_metadata?.user_role;
    
    if (!role) {
      console.warn('No role found in user metadata');
      return null;
    }

    return role.toLowerCase();
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

/**
 * Get the dashboard URL for a given role
 * @param {string} role - The user's role
 * @returns {string} The dashboard URL for the role
 */
function getDashboardForRole(role) {
  const roleMap = {
    'specialist': 'pages/specialist/dashboard.html',
    'staff': 'pages/staff/dashboard.html',
    'administrator': 'pages/administrator/dashboard.html'
  };

  return roleMap[role] || 'pages/dashboard.html';
}

/**
 * Redirect user to their role-appropriate dashboard
 * @returns {Promise<void>}
 */
async function redirectToRoleDashboard() {
  const role = await getUserRole();
  
  if (!role) {
    console.error('Unable to determine user role');
    window.location.href = 'login.html?error=role_not_found';
    return;
  }

  const dashboardUrl = getDashboardForRole(role);
  window.location.href = dashboardUrl;
}

/**
 * Check if current user has required role
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Promise<boolean>} True if user has allowed role
 */
async function hasRole(allowedRoles) {
  const userRole = await getUserRole();
  
  if (!userRole) {
    return false;
  }

  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }

  return userRole === allowedRoles;
}

/**
 * Guard function to protect pages - redirects if user doesn't have required role
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Promise<void>}
 */
async function guardRole(allowedRoles) {
  const { data: { user } } = await window.supabaseClient.auth.getUser();
  
  // Check if user is authenticated
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  // Check if user has required role
  const authorized = await hasRole(allowedRoles);
  
  if (!authorized) {
    // Redirect to user's appropriate dashboard
    await redirectToRoleDashboard();
  }
}

/**
 * Get display name for a role
 * @param {string} role - The role code
 * @returns {string} Display name for the role
 */
function getRoleDisplayName(role) {
  const roleNames = {
    'specialist': 'ITSD Specialist',
    'staff': 'ITSD Staff',
    'administrator': 'ITSD Administrator'
  };

  return roleNames[role] || role;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getUserRole,
    getDashboardForRole,
    redirectToRoleDashboard,
    hasRole,
    guardRole,
    getRoleDisplayName
  };
}