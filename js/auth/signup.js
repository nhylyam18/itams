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
  const passwordRulesTrigger =
    document.querySelector('.password-rules-trigger');


  /*
   * PASSWORD TOGGLE
   */

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


  /*
   * ERROR HANDLING
   */

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


  /*
   * VALIDATION
   */

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


  /*
   * PASSWORD RULE INDICATOR
   */

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


  /*
   * MODALS
   */

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


  /*
   * CLEAR VALIDATION ERRORS
   */

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


  /*
   * SIGNUP
   */

  form.addEventListener('submit', async (event) => {

    event.preventDefault();


    let isValid = true;


    /*
     * FULL NAME
     */

    const fullName =
      fields.fullName.value.trim();

    if (!fullName) {

      showError(
        fields.fullName,
        'Please enter your full name.'
      );

      isValid = false;

    }


    /*
     * EMAIL
     */

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


    /*
     * PASSWORD
     */

    const password =
      fields.password.value;


    if (!hasStrongPassword(password)) {

      showError(
        fields.password,
        'Password does not meet the requirements.'
      );

      isValid = false;

    }


    /*
     * CONFIRM PASSWORD
     */

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


    /*
     * TERMS
     */

    if (!fields.terms.checked) {

      if (checkboxError) {

        checkboxError.textContent =
          'Please accept the Terms of Use and Privacy Policy to continue.';

      }

      isValid = false;

    }


    /*
     * STOP IF VALIDATION FAILED
     */

    if (!isValid) {
      return;
    }


    /*
     * REMOVE OLD STATUS
     */

    const existingStatus =
      form.querySelector('.form-status');

    if (existingStatus) {
      existingStatus.remove();
    }


    /*
     * STATUS MESSAGE
     */

    const status =
      document.createElement('p');

    status.className = 'form-status';

    status.style.fontSize = '0.85rem';
    status.style.textAlign = 'center';
    status.style.marginTop = '0.5rem';
    status.style.fontWeight = '600';

    status.textContent =
      'Creating your account...';

    form.appendChild(status);


    /*
     * DISABLE SUBMIT BUTTON
     */

    const submitButton =
      form.querySelector('button[type="submit"]');

    if (submitButton) {

      submitButton.disabled = true;

      submitButton.textContent =
        'Creating Account...';

    }


    try {

      /*
       * CREATE SUPABASE AUTH USER
       */

      const { data, error } =
        await supabase.auth.signUp({

          email: email,

          password: password,

          options: {

            /*
             * Stored as Auth user metadata.
             * Your current public.users table does
             * not have a full_name column yet.
             */

            data: {
              full_name: fullName
            },

            /*
             * After the user clicks the
             * verification email, send them here.
             */

            emailRedirectTo:
              'https://itams-eight.vercel.app/login.html'

          }

        });


      /*
       * SUPABASE ERROR
       */

      if (error) {

        console.error(
          'Supabase signup error:',
          error
        );

        status.style.color = '#b00020';

        status.textContent =
          error.message;

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            'Create Account';

        }

        return;
      }


      /*
       * SUCCESS
       */

      console.log(
        'Supabase signup successful:',
        data
      );


      status.style.color =
        '#2e7d32';

      status.textContent =
        'Account created! Please check your institutional email to verify your account.';


      /*
       * RESET FORM
       */

      form.reset();

      syncPasswordRulesState();


      /*
       * RE-ENABLE BUTTON
       */

      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
          'Create Account';

      }


    } catch (error) {

      /*
       * UNEXPECTED ERROR
       */

      console.error(
        'Unexpected signup error:',
        error
      );

      status.style.color =
        '#b00020';

      status.textContent =
        'Something went wrong. Please try again.';


      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
          'Create Account';

      }

    }

  });


  /*
   * INITIALIZE PASSWORD RULES
   */

  syncPasswordRulesState();

});