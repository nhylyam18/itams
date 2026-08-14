document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberMe = document.getElementById('remember-me');

    if (!form || !emailInput || !passwordInput) {
        console.error('Login form elements not found.');
        return;
    }

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

    function isValidEmail(value) {
        return /^[a-zA-Z0-9._%+-]+@phinmaed\.com$/.test(value.trim());
    }

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

    emailInput.addEventListener('input', () => {
        clearError(emailInput);
    });

    passwordInput.addEventListener('input', () => {
        clearError(passwordInput);
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        clearError(emailInput);
        clearError(passwordInput);

        let isValid = true;

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!isValidEmail(email)) {
            showError(
                emailInput,
                'Please enter a valid institutional email address.'
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
            const { data, error } =
                await window.supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

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

            console.log(
                'Login successful:',
                data.user
            );

            showFormStatus(
                'Login successful. Redirecting...'
            );

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

            setTimeout(async () => {
                try {
                    // Get user role from metadata
                    const userRole = data.user?.user_metadata?.role || data.user?.user_metadata?.user_role;
                    
                    if (!userRole) {
                        showFormStatus(
                            'Your account role could not be determined. Please contact the ITSD Administrator.',
                            true
                        );
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.textContent = originalButtonText;
                        }
                        return;
                    }

                    // Redirect to role-specific dashboard
                    const roleMap = {
                        'specialist': 'pages/specialist/dashboard.html',
                        'staff': 'pages/staff/dashboard.html',
                        'administrator': 'pages/administrator/dashboard.html'
                    };

                    const dashboardUrl = roleMap[userRole.toLowerCase()] || 'pages/dashboard.html';
                    window.location.href = dashboardUrl;
                } catch (error) {
                    console.error('Role redirection error:', error);
                    showFormStatus(
                        'Error during redirect. Please try again.',
                        true
                    );
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }
                }
            }, 500);

        } catch (error) {
            console.error(
                'Unexpected login error:',
                error
            );

            showFormStatus(
                `Login failed: ${error?.message || String(error)}`,
                true
            );

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent =
                    originalButtonText;
            }
        }
    });

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

    function getLoginErrorMessage(error) {
        const message =
            (error?.message || '').toLowerCase();

        if (
            message.includes('invalid login credentials')
        ) {
            return 'Incorrect email or password.';
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