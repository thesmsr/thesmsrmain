const mailerErrors = [
  "error sending confirmation email",
  "error sending email",
  "email rate limit exceeded",
  "smtp"
];

export function getAuthErrorMessage(error) {
  const message = error?.message || "Authentication failed.";
  const normalized = message.toLowerCase();
  if (mailerErrors.some(fragment => normalized.includes(fragment))) {
    return "Supabase could not send the OTP email. In Supabase, configure custom SMTP, verify the sender email, and make sure the email template contains {{ .Token }}. Then try Send OTP again.";
  }
  if (normalized.includes("signups not allowed")) {
    return "Email signup is disabled in Supabase. Enable Authentication > Settings > User Signups > Allow new users to sign up, then try again.";
  }
  if (normalized.includes("token has expired") || normalized.includes("invalid") || normalized.includes("otp_expired")) {
    return "The verification code is invalid or has expired. If you clicked 'Send OTP' or 'Resend OTP' multiple times, please enter the code from the most recent email received, or click 'Resend OTP' for a fresh code.";
  }
  return message;
}

export async function verifyEmailOtp(client, email, token) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanToken = String(token || "").trim();

  if (!cleanEmail || !cleanToken) {
    return { data: null, error: new Error("Please enter both email address and verification code.") };
  }

  // Supabase supports multiple OTP types depending on project email template settings:
  // 'email' (Email OTP), 'magiclink' (Magic link token), 'signup' (Signup confirmation code), 'recovery' (Recovery code)
  const types = ["email", "magiclink", "signup", "recovery"];
  let finalResult = null;

  for (const type of types) {
    try {
      const result = await client.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type
      });
      if (!result.error) {
        return result;
      }
      finalResult = result;
      const msg = (result.error.message || "").toLowerCase();
      if (msg.includes("rate limit") || msg.includes("network") || msg.includes("fetch")) {
        return result;
      }
    } catch (err) {
      finalResult = { data: null, error: err };
    }
  }

  return finalResult || { data: null, error: new Error("Token has expired or is invalid.") };
}
