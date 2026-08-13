// js/config/supabase.js - Supabase config and client for ITAMS
// This file creates the Supabase client for frontend usage.
//
// IMPORTANT:
// - The publishable/anon key is safe to use in frontend code.
// - NEVER put your Supabase service_role/secret key here.
// - Security should be enforced using Supabase Row Level Security (RLS).

(function () {
    // =========================================================
    // SUPABASE PROJECT CONFIGURATION
    // =========================================================

    // Replace this with your actual Supabase Project URL.
    // Example:
    // https://xxxxxxxxxxxxxxxx.supabase.co
    const SUPABASE_URL = 'https://irjlcazottoytkqiuojh.supabase.co';

    // Your Supabase publishable key.
    const SUPABASE_ANON_KEY =
        'sb_publishable_A6wHQ81V9LtQJUM70APDGw_kZQDqNtH';


    // =========================================================
    // VALIDATE CONFIGURATION
    // =========================================================

    const hasPlaceholderUrl =
        !SUPABASE_URL ||
        SUPABASE_URL.includes('YOUR_SUPABASE') ||
        !/^https?:\/\//i.test(SUPABASE_URL);

    const hasPlaceholderAnonKey =
        !SUPABASE_ANON_KEY ||
        SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');

    if (hasPlaceholderUrl || hasPlaceholderAnonKey) {
        console.warn(
            'Supabase is not configured yet. ' +
            'Please add your Supabase Project URL in supabase.js.'
        );

        window.supabaseClient = {
            testConnection: async function () {
                return {
                    ok: false,
                    error:
                        'Supabase is not configured. ' +
                        'Add your project URL and publishable key.'
                };
            }
        };

        return;
    }


    // =========================================================
    // CHECK SUPABASE JAVASCRIPT LIBRARY
    // =========================================================

    // The Supabase JS library must be loaded before this file.
    //
    // Example:
    // <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    // <script src="js/config/supabase.js"></script>

    if (
        typeof supabase === 'undefined' ||
        !supabase.createClient
    ) {
        console.error(
            'Supabase JS library not found. ' +
            'Make sure the Supabase CDN script is loaded before supabase.js.'
        );

        window.supabaseClient = {
            testConnection: async function () {
                return {
                    ok: false,
                    error: 'Supabase JS library not found.'
                };
            }
        };

        return;
    }


    // =========================================================
    // CREATE SUPABASE CLIENT
    // =========================================================

    const client = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


    // =========================================================
    // MAKE CLIENT AVAILABLE TO THE WHOLE WEBSITE
    // =========================================================

    // Other JavaScript files can now access Supabase using:
    //
    // window.supabaseClient
    //
    // Example:
    // const { data, error } =
    //     await window.supabaseClient.auth.getSession();

    window.supabaseClient = client;


    // =========================================================
    // SUPABASE CONNECTION TEST
    // =========================================================

    async function testConnection() {
        try {
            // getSession() contacts Supabase Auth.
            // It does NOT log the user in.
            const response = await client.auth.getSession();

            console.log(
                'Supabase testConnection response:',
                response
            );

            if (response.error) {
                return {
                    ok: false,
                    error: response.error
                };
            }

            return {
                ok: true,
                info: response
            };

        } catch (error) {
            console.error(
                'Supabase connection test failed:',
                error
            );

            return {
                ok: false,
                error: error
            };
        }
    }


    // Attach the test function to the client.
    window.supabaseClient.testConnection = testConnection;


    // =========================================================
    // INITIALIZATION MESSAGE
    // =========================================================

    console.log('Supabase client initialized successfully.');
})();