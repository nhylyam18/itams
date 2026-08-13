// js/config/supabase.js - Supabase config and client for ITAMS

(function () {

    const SUPABASE_URL =
        'https://irjlcazottoytkqiuojh.supabase.co';

    const SUPABASE_ANON_KEY =
        'sb_publishable_A6wHQ81V9LtQJUM70APDGw_kZQDqNtH';


    const hasPlaceholderUrl =
        !SUPABASE_URL ||
        SUPABASE_URL.includes('YOUR_SUPABASE') ||
        !/^https?:\/\//i.test(SUPABASE_URL);

    const hasPlaceholderAnonKey =
        !SUPABASE_ANON_KEY ||
        SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');


    if (hasPlaceholderUrl || hasPlaceholderAnonKey) {

        console.error(
            'Supabase configuration is incomplete.'
        );

        window.supabaseClient = {
            testConnection: async function () {
                return {
                    ok: false,
                    error:
                        'Supabase is not configured. Check SUPABASE_URL and SUPABASE_ANON_KEY.'
                };
            }
        };

        return;
    }


    if (
        typeof window.supabase === 'undefined' ||
        typeof window.supabase.createClient !== 'function'
    ) {

        console.error(
            'Supabase JS library not found. ' +
            'Make sure the Supabase CDN script is loaded before supabase.js.'
        );

        window.supabaseClient = {
            testConnection: async function () {
                return {
                    ok: false,
                    error:
                        'Supabase JS library not found.'
                };
            }
        };

        return;
    }


    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );


    window.supabaseClient =
        supabaseClient;


    window.supabase =
        supabaseClient;


    async function testConnection() {

        try {

            const response =
                await supabaseClient.auth.getSession();


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


    window.supabaseClient.testConnection =
        testConnection;


    console.log(
        'Supabase client initialized successfully.'
    );

    console.log(
        'Supabase URL:',
        SUPABASE_URL
    );

    console.log(
        'Supabase Auth available:',
        !!window.supabase.auth
    );

})();