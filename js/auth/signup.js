document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('signup-form');

  const fields = {
    fullName: document.getElementById('signup-name'),
    email: document.getElementById('signup-email'),
    password: document.getElementById('signup-password'),
    confirmPassword: document.getElementById('signup-confirm-password'),
    terms: document.getElementById('terms-check'),
    role: document.querySelector('input[name="role"]:checked')
  };

  const checkboxError = document.querySelector('.checkbox-error');
  const passwordRulesTrigger =
    document.querySelector('.password-rules-trigger');


  function setupPasswordToggle(button) {

    button.addEventListener('click', (event) => {

      event.preventDefault();

      const targetId = button.getAttribute('data-target');
      const target = document.getElementById(targetId);

      if (!target) return;

      const isPassword = target.type === 'password';

      target.type = isPassword ? 'text' : 'password';

      button.textContent = isPassword ? 'Hide' : 'Show';

      button.setAttribute(
        'aria-label',
        isPassword ? 'Hide password' : 'Show password'
      );

    });

  }


  document
    .querySelectorAll('.toggle-password')
    .forEach(setupPasswordToggle);


  function showError(input, message) {

    const errorNode =
      input.closest('.field-group')?.querySelector('.error-message')
      || checkboxError;

    if (input && input.classList) {
      input.classList.add('is-invalid');
    }

    if (errorNode) {
      errorNode.textContent = message;
    }

  }


  function clearError(input) {

    const errorNode =
      input.closest('.field-group')?.querySelector('.error-message')
      || checkboxError;

    if (input && input.classList) {
      input.classList.remove('is-invalid');
    }

    if (errorNode) {
      errorNode.textContent = '';
    }

  }


  function isValidEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim()
    );

  }


  function isInstitutionalEmail(value) {

    return value
      .trim()
      .toLowerCase()
      .endsWith('@phinmaed.com');

  }


  function hasStrongPassword(value) {

    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
      value
    );

  }


  function syncPasswordRulesState() {

    const value = fields.password.value.trim();

    if (!passwordRulesTrigger) return;

    if (!value) {

      passwordRulesTrigger.classList.remove('is-visible');

      return;
    }

    passwordRulesTrigger.classList.toggle(
      'is-visible',
      !hasStrongPassword(value)
    );

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


  document
    .querySelectorAll('.inline-policy-link')
    .forEach((link) => {

      link.addEventListener('click', (event) => {

        event.preventDefault();

        const modalId = link.dataset.modal;

        openModal(modalId);

      });

    });


  document
    .querySelectorAll('.modal-close')
    .forEach((button) => {

      button.addEventListener('click', () => {

        const modal =
          button.closest('.modal-backdrop');

        if (modal) {
          closeModal(modal.id);
        }

      });

    });


  document
    .querySelectorAll('.modal-backdrop')
    .forEach((backdrop) => {

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

      document
        .querySelectorAll('.modal-backdrop')
        .forEach((modal) => {

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

  // Role selection event listeners
  document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const roleError = document.querySelector('.field-group:last-of-type .error-message');
      if (roleError) {
        roleError.textContent = '';
      }
    });
  });


  form.addEventListener('submit', async (event) => {

    event.preventDefault();

    let isValid = true;


    const fullName =
      fields.fullName.value.trim();

    if (!fullName) {

      showError(
        fields.fullName,
        'Please enter your full name.'
      );

      isValid = false;

    }


    const email =
      fields.email.value.trim().toLowerCase();


    if (!isValidEmail(email)) {

      showError(
        fields.email,
        'Please enter a valid email address.'
      );

      isValid = false;

    } else if (!isInstitutionalEmail(email)) {

      showError(
        fields.email,
        'Please use your institutional @phinmaed.com email.'
      );

      isValid = false;

    }


    const password =
      fields.password.value;


    if (!hasStrongPassword(password)) {

      showError(
        fields.password,
        'Password does not meet the requirements.'
      );

      isValid = false;

    }


    if (
      fields.confirmPassword.value !== password ||
      !fields.confirmPassword.value.trim()
    ) {

      showError(
        fields.confirmPassword,
        'Passwords do not match.'
      );

      isValid = false;

    }


    if (!fields.terms.checked) {

      if (checkboxError) {

        checkboxError.textContent =
          'Please accept the Terms of Use and Privacy Policy to continue.';

      }

      isValid = false;

    }

    const selectedRole = document.querySelector('input[name="role"]:checked');
    if (!selectedRole) {
      const roleError = document.querySelector('.field-group:last-of-type .error-message');
      if (roleError) {
        roleError.textContent = 'Please select an account role.';
      }
      isValid = false;
    }


    if (!isValid) {
      return;
    }


    const existingStatus =
      form.querySelector('.form-status');

    if (existingStatus) {
      existingStatus.remove();
    }


    const status =
      document.createElement('p');

    status.className = 'form-status';

    status.style.fontSize = '0.85rem';
    status.style.textAlign = 'center';
    status.style.marginTop = '0.5rem';
    status.style.fontWeight = '600';
    status.style.whiteSpace = 'pre-line';

    status.textContent =
      'Creating your account...';

    form.appendChild(status);


    const submitButton =
      form.querySelector('button[type="submit"]');

    if (submitButton) {

      submitButton.disabled = true;

      submitButton.textContent =
        'Creating Account...';

    }


    try {

      if (
        !window.supabaseClient ||
        !window.supabaseClient.auth ||
        typeof window.supabaseClient.auth.signUp !== 'function'
      ) {

        throw new Error(
          'Supabase Auth is not available. Please check that supabase.js is loaded correctly.'
        );

      }


      const selectedRole = document.querySelector('input[name="role"]:checked');
      const userRole = selectedRole ? selectedRole.value : 'specialist';

      const { data, error } =
        await window.supabaseClient.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {
              full_name: fullName,
              role: userRole
            }

          }

        });


      if (error) {

        console.error(
          'Supabase signup error:',
          error
        );

        status.style.color = '#b00020';

        status.textContent =
          `ACCOUNT CREATION FAILED\n\nMessage: ${error.message || 'Unknown Supabase error'}\nCode: ${error.code || 'N/A'}\nStatus: ${error.status || 'N/A'}`;

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            'Create Account';

        }

        return;
      }


      console.log(
        'Supabase signup successful:',
        data
      );


      status.style.color =
        '#2e7d32';

      status.textContent =
        'Account created successfully!';


      form.reset();

      syncPasswordRulesState();


      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
          'Create Account';

      }


    } catch (error) {

      console.error(
        'UNEXPECTED ACCOUNT CREATION ERROR:',
        error
      );

      console.error(
        'Error name:',
        error?.name
      );

      console.error(
        'Error message:',
        error?.message
      );

      console.error(
        'Error code:',
        error?.code
      );

      console.error(
        'Error status:',
        error?.status
      );

      console.error(
        'Error stack:',
        error?.stack
      );


      status.style.color =
        '#b00020';

      status.textContent =
        `UNEXPECTED ACCOUNT CREATION ERROR\n\nName: ${error?.name || 'N/A'}\nMessage: ${error?.message || String(error)}\nCode: ${error?.code || 'N/A'}\nStatus: ${error?.status || 'N/A'}`;


      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
          'Create Account';

      }

    }

  });


  syncPasswordRulesState();

});