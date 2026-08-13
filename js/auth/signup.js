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
    status.style.whiteSpace = 'pre-line';

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

      console.log('========================================');
      console.log('ITAMS ACCOUNT CREATION STARTED');
      console.log('========================================');

      console.log('STEP 1: Checking Supabase client');

      if (typeof supabase === 'undefined') {

        throw new Error(
          'Supabase client is undefined. Check your supabase.js file and make sure it is loaded before signup.js.'
        );

      }

      console.log('STEP 2: Supabase client detected');
      console.log('Supabase client:', supabase);

      console.log('STEP 3: Preparing signup request');
      console.log('Email:', email);
      console.log('Full name:', fullName);
      console.log('Password provided:', password ? 'YES' : 'NO');
      console.log(
        'Redirect URL:',
        'https://itams-eight.vercel.app/login.html'
      );

      console.log('STEP 4: Calling supabase.auth.signUp()');


      /*
       * CREATE SUPABASE AUTH USER
       */

      const { data, error } =
        await supabase.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {
              full_name: fullName
            },

            emailRedirectTo:
              'https://itams-eight.vercel.app/login.html'

          }

        });


      console.log('STEP 5: Supabase response received');
      console.log('Response data:', data);
      console.log('Response error:', error);


      /*
       * SUPABASE ERROR
       */

      if (error) {

        console.error('========================================');
        console.error('SUPABASE ACCOUNT CREATION ERROR');
        console.error('========================================');

        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error status:', error.status);
        console.error('Error details:', error);

        status.style.color = '#b00020';
        status.style.whiteSpace = 'pre-line';

        status.textContent =
          'ACCOUNT CREATION FAILED\n\n' +
          'Message: ' +
          (error.message || 'No error message returned') +
          '\n\n' +
          'Code: ' +
          (error.code || 'N/A') +
          '\n\n' +
          'Status: ' +
          (error.status || 'N/A');

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

      console.log('========================================');
      console.log('ACCOUNT CREATION SUCCESSFUL');
      console.log('========================================');

      console.log('User object:', data?.user);
      console.log('User ID:', data?.user?.id);
      console.log('User email:', data?.user?.email);
      console.log(
        'Email confirmed at:',
        data?.user?.email_confirmed_at
      );
      console.log('Session:', data?.session);


      status.style.color =
        '#2e7d32';

      status.style.whiteSpace =
        'pre-line';


      if (data?.user && !data?.session) {

        status.textContent =
          'ACCOUNT CREATED SUCCESSFULLY!\n\n' +
          'Please check your institutional email and click the verification link before signing in.';

      } else {

        status.textContent =
          'ACCOUNT CREATED SUCCESSFULLY!';

      }


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

      console.error('========================================');
      console.error('UNEXPECTED ACCOUNT CREATION ERROR');
      console.error('========================================');

      console.error('Error object:', error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('Error status:', error?.status);
      console.error('Error stack:', error?.stack);


      status.style.color =
        '#b00020';

      status.style.whiteSpace =
        'pre-line';


      status.textContent =
        'UNEXPECTED ACCOUNT CREATION ERROR\n\n' +
        'Name: ' +
        (error?.name || 'Unknown') +
        '\n\n' +
        'Message: ' +
        (error?.message || String(error)) +
        '\n\n' +
        'Code: ' +
        (error?.code || 'N/A') +
        '\n\n' +
        'Status: ' +
        (error?.status || 'N/A');


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