document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const fields = {
    fullName: document.getElementById('signup-name'),
    email: document.getElementById('signup-email'),
    password: document.getElementById('signup-password'),
    confirmPassword: document.getElementById('signup-confirm-password'),
    terms: document.getElementById('terms-check')
  };

  const checkboxError = document.querySelector('.checkbox-error');
  const passwordRulesTrigger = document.querySelector('.password-rules-trigger');

  function setupPasswordToggle(button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (!target) return;

      const isPassword = target.type === 'password';
      target.type = isPassword ? 'text' : 'password';
      button.textContent = isPassword ? 'Hide' : 'Show';
      button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  document.querySelectorAll('.toggle-password').forEach(setupPasswordToggle);

  function showError(input, message) {
    const errorNode = input.closest('.field-group')?.querySelector('.error-message') || checkboxError;

    if (input && input.classList) {
      input.classList.add('is-invalid');
    }

    if (errorNode) {
      errorNode.textContent = message;
    }
  }

  function clearError(input) {
    const errorNode = input.closest('.field-group')?.querySelector('.error-message') || checkboxError;

    if (input && input.classList) {
      input.classList.remove('is-invalid');
    }

    if (errorNode) {
      errorNode.textContent = '';
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function hasStrongPassword(value) {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
  }

  function syncPasswordRulesState() {
    const value = fields.password.value.trim();

    if (!passwordRulesTrigger) return;

    if (!value) {
      passwordRulesTrigger.classList.remove('is-visible');
      return;
    }

    passwordRulesTrigger.classList.toggle('is-visible', !hasStrongPassword(value));
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.inline-policy-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const modalId = link.dataset.modal;
      openModal(modalId);
    });
  });

  document.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal-backdrop');
      if (modal) closeModal(modal.id);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        closeModal(backdrop.id);
      }
    });

    const modal = backdrop.querySelector('.modal');
    if (modal) {
      modal.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop').forEach((modal) => {
        if (!modal.classList.contains('hidden')) {
          closeModal(modal.id);
        }
      });
    }
  });

  Object.entries(fields).forEach(([name, field]) => {
    if (!field) return;

    field.addEventListener('input', () => {
      if (name === 'terms') {
        if (field.checked && checkboxError) {
          checkboxError.textContent = '';
        }
        return;
      }

      clearError(field);

      if (name === 'password') {
        syncPasswordRulesState();
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;

    if (!fields.fullName.value.trim()) {
      showError(fields.fullName, 'Please enter your full name.');
      isValid = false;
    }

    if (!isValidEmail(fields.email.value)) {
      showError(fields.email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!hasStrongPassword(fields.password.value)) {
      showError(fields.password, 'Password does not meet the requirements.');
      isValid = false;
    }

    if (fields.confirmPassword.value !== fields.password.value || !fields.confirmPassword.value.trim()) {
      showError(fields.confirmPassword, 'Passwords do not match.');
      isValid = false;
    }

    if (!fields.terms.checked) {
      if (checkboxError) {
        checkboxError.textContent = 'Please accept the Terms of Use and Privacy Policy to continue.';
      }
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const existingStatus = form.querySelector('.form-status');
    if (existingStatus) {
      existingStatus.remove();
    }

    const status = document.createElement('p');
    status.className = 'form-status';
    status.style.color = '#2e7d32';
    status.style.fontSize = '0.85rem';
    status.style.textAlign = 'center';
    status.style.marginTop = '0.5rem';
    status.style.fontWeight = '600';
    status.textContent = 'Account creation flow will be connected later.';

    form.appendChild(status);
  });

  syncPasswordRulesState();
});