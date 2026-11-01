# thesmsrmain

# SMSR website

```
npm install
npm run dev
```

The local site is served at `http://127.0.0.1:5173`. Keep the development server running
while completing Google sign-in; the OAuth callback returns to the same local origin.

## Content management

The public site reads published content from Supabase. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor before using the CMS. The schema creates the content tables, row-level security policies, and starter records.

Open `/#/admin` to sign in with an approved administrator email. The control room can create, edit, publish/unpublish, reorder, and delete:

- Page titles and introductory copy
- Reusable page sections, including service detail sections and policy/contact/donation sections
- Services
- Gallery records and image URLs
- Reviews and reviewer photo URLs
- Notifications
- Footer/site settings

The Student, Faculty, and Member login portals include the life-membership registration
form. The selected portal is saved as the registration category automatically. The Admin
portal intentionally does not show public registration. Registration fields and document
paths are stored in `membership_applications`; uploaded documents are private and can be
opened only by administrators. All registration fields and the three required uploads
(qualification, signature, and passport photo) must be completed.

After submission, the application and document paths are saved in the database first.
Supabase then sends a one-time email code. Entering that code completes the account
creation/login and securely links the verified auth user ID to the registration record.
The application ID shown in the confirmation is the registration reference and is also
stored in the database. Admins can manage users, applications, access status, roles,
password-reset emails, resend emails, and latest news from the dashboard. Passwords are
never displayed. The database also records an immutable audit trail for every
registration submission, edit, status change, and deletion. Admins can inspect these
snapshots in the **Audit trail** tab and download the saved form copy.

Email OTP login is open for new Student, Faculty, and Member users and creates their
Supabase account automatically. Admin OTP remains limited to existing approved admin
accounts. If OTP signup is rejected, enable **Authentication > Settings > User Signups >
Allow new users to sign up** in Supabase.

If login shows **"Supabase could not send the OTP email"**, configure and save custom
SMTP under **Authentication > SMTP Settings**. This is a Supabase project setting and
cannot be installed by the SQL schema. Verify the sender mailbox, Gmail App Password,
and an email template containing `{{ .Token }}`.
The default Supabase mailer is only for testing, may deliver only to project-team
addresses, and has a very small rate limit, so it will not support public users reliably.

After a successful member OTP or Google login, the app opens the role-specific
`/#/dashboard` instead of showing the login form again. Student, Faculty, and Member
users receive different dashboard content while their email, user ID, category, access
status, and linked membership registration remain loaded from the database. Revoked or
deleted users cannot continue into the dashboard.
Administrators can edit the dashboard cards through Page sections using the page slugs
`student-dashboard`, `faculty-dashboard`, and `member-dashboard`.

Google OAuth must be completed in a normal browser window with JavaScript and cookies
enabled. Embedded browser previews can be rejected by Google before the app receives
the login response; use Chrome, Edge, Safari, or Firefox for the OAuth test.

For images, either upload an image from the relevant admin field (the schema creates the `site-media` bucket) or add a public image URL in the `Image URL` or `Photo URL` field. Clearing or deleting a record removes it from the published site once the page reloads.

The files in `src/data.js` and the component defaults are only offline fallbacks used when Supabase is not configured. The 3D hero is `src/components/LogoAnimation.jsx`.
