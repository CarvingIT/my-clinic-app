/**
 * ROOT INDEX — Demo Bypass Mode
 * ─────────────────────────────────────────────────────────────
 * This file redirects the app directly to the SplashScreen,
 * bypassing the normal auth / login flow so all UI screens
 * can be viewed without a backend or env variables.
 *
 * ✅ TO RESTORE NORMAL AUTH FLOW:
 *    Replace the content of this file with the original auth
 *    redirect logic (check session → go to login or dashboard).
 *    The original login.tsx and ctx.tsx are untouched.
 * ─────────────────────────────────────────────────────────────
 */
import { Redirect } from 'expo-router';

export default function Index() {
    // Bypass auth — go straight to the branded splash screen
    return <Redirect href="/splash-screen" />;
}
