import { supabase } from "@/integrations/supabase/client";

const SIGN_IN_TIMEOUT_MS = 15000;

export const getFriendlyAuthError = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes("failed to fetch")) {
    return "We couldn't reach the authentication service from this browser. Please disable VPN/ad blockers/firewall filtering and try again.";
  }

  if (normalized.includes("timed out")) {
    return "Sign-in is taking too long. Please try again, or switch networks/VPN settings.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Invalid email or password. Please verify credentials and try again.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }

  return message;
};

export const signInWithPassword = async (email: string, password: string) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Sign-in request timed out. Please try again."));
      }, SIGN_IN_TIMEOUT_MS);
    });

    return await Promise.race([
      supabase.auth.signInWithPassword({ email, password }),
      timeoutPromise,
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};
