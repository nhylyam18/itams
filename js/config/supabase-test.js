// js/config/supabase-test.js - Simple connection test runner
(async function () {
  if (!window.supabaseClient || !window.supabaseClient.testConnection) {
    console.warn('supabaseClient or testConnection not available.');
    return;
  }

  const result = await window.supabaseClient.testConnection();
  // Log and optionally update a DOM element with id `supabase-status` if present.
  console.log('Supabase connection test result:', result);
  const el = document.getElementById('supabase-status');
  if (el) {
    el.textContent = result.ok ? 'Supabase: reachable' : 'Supabase: unreachable';
    el.style.color = result.ok ? 'green' : 'red';
  }
})();
