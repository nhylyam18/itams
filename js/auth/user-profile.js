// js/auth/user-profile.js - Dynamic user profile display

document.addEventListener('DOMContentLoaded', async () => {
  const userNameElement = document.getElementById('user-name');
  const userRoleElement = document.getElementById('user-role');
  const userAvatarElement = document.getElementById('user-avatar');

  if (!userNameElement || !userRoleElement || !userAvatarElement) {
    return;
  }

  try {
    const { data: { user }, error } = await window.supabaseClient.auth.getUser();
    
    if (error || !user) {
      console.error('Error getting user:', error);
      return;
    }

    // Get user information from metadata
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
    const role = user.user_metadata?.role || user.user_metadata?.user_role || 'Staff';
    const email = user.email || '';

    // Generate initials for avatar
    const initials = getInitials(fullName);
    
    // Update profile display
    userNameElement.textContent = fullName;
    userRoleElement.textContent = getRoleDisplayName(role);
    userAvatarElement.textContent = initials;

  } catch (error) {
    console.error('Error loading user profile:', error);
  }
});

function getInitials(name) {
  if (!name) return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getRoleDisplayName(role) {
  const roleNames = {
    'specialist': 'ITSD Specialist',
    'staff': 'ITSD Staff',
    'administrator': 'ITSD Administrator'
  };

  return roleNames[role?.toLowerCase()] || role || 'ITSD Staff';
}