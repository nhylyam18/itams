document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberMe = document.getElementById('remember-me');

    // Make sure the login form exists.
    if (!form || !emailInput || !passwordInput) {
        console.error('Login form elements not found.');
        return;
    }

    // =========================================================
    // ERROR HANDLING
    // =========================================================

    function showError(input, message) {
        const errorNode = input
            .closest('.field-group')
            ?.querySelector('.error-message');

        if (input) {
            input.classList.add('is-invalid');
        }

        if (errorNode) {
            errorNode.textContent = message;
        }
    }

    function clearError(input) {
        const errorNode = input
            .closest('.field-group')
            ?.querySelector('.error-message');

        if (input) {
            input.classList.remove('is-invalid');
        }

        if (errorNode) {
            errorNode.textContent = '';
        }
    }

    // =========================================================
    // EMAIL VALIDATION
    // =========================================================

    function isValidEmail(value) {
        return /^[a-zA-Z0-9._%+-]+@phinmaed\.com$/.test(value.trim());
    }

    // =========================================================
    // PASSWORD SHOW / HIDE
    // =========================================================

    document.querySelectorAll('.toggle-password').forEach((button) => {
        button.addEventListener('click', () => {
            const target = document.getElementById(
                button.dataset.target
            );

            if (!target) {
                return;
            }

            const isPassword = target.type === 'password';

            target.type = isPassword ? 'text' : 'password';

            button.textContent = isPassword ? 'Hide' : 'Show';

            button.setAttribute(
                'aria-label',
                isPassword
                    ? 'Hide password'
                    : 'Show password'
            );
        });
    });

    // =========================================================
    // CLEAR ERRORS WHEN USER TYPES
    // =========================================================

    emailInput.addEventListener('input', () => {
        clearError(emailInput);
    });

    passwordInput.addEventListener('input', () => {
        clearError(passwordInput);
    });

    // =========================================================
    // FORM SUBMISSION
    // =========================================================

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Clear previous errors.
        clearError(emailInput);
        clearError(passwordInput);

        let isValid = true;

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // -----------------------------------------------------
        // CLIENT-SIDE VALIDATION
        // -----------------------------------------------------

        if (!isValidEmail(email)) {
            showError(
                emailInput,
                'Please enter a valid email address.'
            );

            isValid = false;
        }

        if (!password.trim()) {
            showError(
                passwordInput,
                'Please enter your password.'
            );

            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // -----------------------------------------------------
        // CHECK SUPABASE CLIENT
        // -----------------------------------------------------

        if (
            !window.supabaseClient ||
            !window.supabaseClient.auth
        ) {
            showFormStatus(
                'Unable to connect to the authentication service. Please try again.',
                true
            );

            console.error(
                'Supabase client is not available.'
            );

            return;
        }

        // -----------------------------------------------------
        // SHOW LOADING STATE
        // -----------------------------------------------------

        const submitButton =
            form.querySelector('button[type="submit"]');

        const originalButtonText =
            submitButton?.textContent || 'Sign In';

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Signing in...';
        }

        showFormStatus('Signing in...');

        try {

            // -------------------------------------------------
            // SUPABASE LOGIN
            // -------------------------------------------------

            const { data, error } =
                await window.supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            // -------------------------------------------------
            // HANDLE LOGIN ERROR
            // -------------------------------------------------

            if (error) {
                console.error(
                    'Supabase login error:',
                    error
                );

                showFormStatus(
                    getLoginErrorMessage(error),
                    true
                );

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent =
                        originalButtonText;
                }

                return;
            }

            // -------------------------------------------------
            // LOGIN SUCCESSFUL
            // -------------------------------------------------

            console.log(
                'Login successful:',
                data.user
            );

            showFormStatus(
                'Login successful. Redirecting...'
            );

            // -------------------------------------------------
            // REMEMBER ME
            // -------------------------------------------------

            // Supabase normally keeps the authentication session
            // in browser storage automatically.
            //
            // The checkbox is currently used to determine whether
            // the user's email should be remembered locally.
            if (rememberMe?.checked) {
                localStorage.setItem(
                    'itams_remembered_email',
                    email
                );
            } else {
                localStorage.removeItem(
                    'itams_remembered_email'
                );
            }

            // -------------------------------------------------
            // REDIRECT TO HOME
            // -------------------------------------------------

            setTimeout(() => {
                window.location.href = 'home.html';
            }, 500);

        } catch (error) {

            console.error(
                'Unexpected login error:',
                error
            );

            showFormStatus(
                'Something went wrong. Please try again.',
                true
            );

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent =
                    originalButtonText;
            }
        }
    });

    // =========================================================
    // FORM STATUS MESSAGE
    // =========================================================

    function showFormStatus(message, isError = false) {

        const existingStatus =
            form.querySelector('.form-status');

        if (existingStatus) {
            existingStatus.remove();
        }

        const status =
            document.createElement('p');

        status.className =
            `form-status${isError ? ' form-status-error' : ''}`;

        status.setAttribute(
            'role',
            isError ? 'alert' : 'status'
        );

        status.textContent = message;

        form.appendChild(status);
    }

    // =========================================================
    // SUPABASE ERROR MESSAGES
    // =========================================================

    function getLoginErrorMessage(error) {

        const message =
            (error?.message || '').toLowerCase();

        if (
            message.includes('invalid login credentials')
        ) {
            return 'Incorrect email or password.';
        }

        if (
            message.includes('email not confirmed')
        ) {
            return 'Please confirm your email address before signing in.';
        }

        if (
            message.includes('too many requests')
        ) {
            return 'Too many login attempts. Please wait a moment and try again.';
        }

        return (
            error?.message ||
            'Unable to sign in. Please check your credentials and try again.'
        );
    }

    // =========================================================
    // REMEMBERED EMAIL
    // =========================================================

    const rememberedEmail =
        localStorage.getItem(
            'itams_remembered_email'
        );

    if (rememberedEmail) {
        emailInput.value = rememberedEmail;

        if (rememberMe) {
            rememberMe.checked = true;
        }
    }
});