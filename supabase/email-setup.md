# SMSR OTP email setup

The Login page sends OTP requests through Supabase Auth. Configure the organisation mailbox in the Supabase Dashboard:

1. Open **Authentication > SMTP Settings**.
2. Enable custom SMTP.
3. Set the sender email to `thesmsr18@gmail.com`.
4. Set the sender name to `SMSR`.
5. Configure an SMTP provider for that mailbox. For Gmail, use the mailbox SMTP details and an App Password, not the normal mailbox password.
6. In **Authentication > Email Templates**, replace the **Confirm signup** and
   **Magic Link** templates with the HTML in
   [`otp-email-template.html`](./otp-email-template.html). Keep `{{ .Token }}` in
   the template and remove the `{{ .ConfirmationURL }}` button if you want a code-only
   email.
7. Confirm the Supabase Auth redirect URL includes the deployed site URL.

## Why the default Supabase mailer fails

Supabase's built-in SMTP service is only for testing. It may deliver only to members
of the Supabase project's team and has a very small, changeable rate limit (currently
about two messages per hour). It is not a general free mail service for public
registrations. If the recipient is not a project-team email, Auth can return
**Error sending confirmation email** even though the OTP request and database are
otherwise correct.

For Student, Faculty, Member, and public registration emails, enable custom SMTP
below. A Gmail App Password is one option; a transactional provider such as Brevo
can also provide a free sending allowance. The provider must support SMTP.

If the app displays **"Error sending confirmation email"**, the database and frontend
are not the cause. Supabase Auth has accepted the request but its mailer could not
deliver the message. Recheck all SMTP fields, remove spaces from the Gmail App Password,
save the SMTP configuration, and use **Send OTP** again. The Gmail account must have
two-step verification enabled and the App Password must be generated for that same
mailbox. Do not put SMTP credentials in this repository or frontend environment
variables.

## Gmail values

Use these values in the SMTP form:

| Field | Value |
| --- | --- |
| Sender email address | `thesmsr18@gmail.com` |
| Sender name | `SMSR` |
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | `thesmsr18@gmail.com` |
| Password | A Gmail App Password for this mailbox |

Use port `465` only if the provider is configured for implicit SSL. Port `587` is the usual Gmail STARTTLS setting. Create the App Password in Google Account security after enabling two-step verification; never commit it to the repository or put it in `.env.local`.

The application calls `supabase.auth.signInWithOtp()` and `supabase.auth.verifyOtp()` from
the Login and Registration pages. Registration saves the form first, then links the
verified auth user to the application through the `claim_membership_application` database
function. Registration changes are recorded by the `membership_application_audit` table.
No mailbox password belongs in the frontend or `.env.local` file.

## Make the email an OTP instead of a confirmation link

The message containing **"Confirm your email address"** is the default Supabase
**Confirm signup** template. It contains a link because that template uses
`{{ .ConfirmationURL }}`. To send a code:

1. Open **Authentication > Email Templates > Confirm signup**.
2. Set the subject to `Your SMSR verification code`.
3. Replace the body with [`otp-email-template.html`](./otp-email-template.html).
4. Repeat for **Magic Link**, because existing users receive that template.
5. Save both templates.

The app accepts both Supabase email OTP tokens and signup tokens, so new users and
existing users can enter the same six-digit code field.

For Student, Faculty, and Member portals, OTP login creates the user automatically when
the email does not exist yet. Admin OTP remains restricted to existing administrator
accounts. In Supabase, open **Authentication > Settings > User Signups** and ensure
**Allow new users to sign up** is enabled; otherwise Supabase will return `Signups not
allowed for otp` even when the frontend is configured correctly.

## Google sign-in setup

Google sign-in is a separate OAuth integration. A Gmail App Password cannot authenticate Google sign-in; it is only used by Supabase's custom SMTP server to send OTP emails.

1. In Google Cloud Console, create or select a project.
2. Configure the OAuth consent screen.
3. Create an OAuth client ID for a **Web application**.
4. In the Google client, add the Supabase callback URL shown in **Supabase Dashboard > Authentication > Providers > Google**. It normally looks like:
   `https://<project-ref>.supabase.co/auth/v1/callback`
5. In Supabase, enable **Authentication > Providers > Google** and paste the Google client ID and client secret.
6. In **Authentication > URL Configuration**, add the local and deployed site URLs as allowed redirect URLs, for example:
   - `http://localhost:5173/**`
   - `http://127.0.0.1:5173/**`
   - `https://your-domain.example/**`
7. Use **Continue with Google** on `/#/membership` or `/#/admin`.

The app stores the intended destination before starting Google OAuth and also includes
it in the callback URL. Admin sign-in returns to `/#/admin`; member sign-in returns to
`/#/account`. If an old callback
returns to the home page, clear the browser's site data once and start again from the
exact portal URL.

If Google shows **"The browser you're using doesn't support JavaScript"** or
**"Couldn't sign you in"**, open the local site in a normal Chrome, Edge, Safari, or
Firefox window rather than an embedded/automated browser preview. JavaScript and
third-party cookies must be enabled. This Google error occurs before Supabase receives
the OAuth response and cannot be fixed by frontend code.

Run the local site with `npm run dev` and open `http://127.0.0.1:5173`. The Vite configuration
uses port 5173 and will stop with a clear error if that port is already in use instead of
silently switching to another port. If Google sends you to a refused `127.0.0.1` address,
restart the development server and use the exact URL printed by Vite.

The first Google login creates one Supabase Auth user and a corresponding `profiles` row. It does not create four separate users. To make the official Google account an administrator, log in once with that account, then run:

```sql
update public.profiles p
set role = 'admin', updated_at = now()
from auth.users u
where p.id = u.id
  and u.email = 'your-official-email@example.com';
```

Do not send the Google client secret or Gmail App Password in chat, commit them to the repository, or place them in frontend environment variables.
