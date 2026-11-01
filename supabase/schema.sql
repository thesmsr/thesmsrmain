-- SMSR CMS schema
-- Run this in Supabase SQL Editor before using /#/admin.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'member' check (role in ('member', 'admin')),
  category text not null default 'Member',
  status text not null default 'active' check (status in ('active', 'revoked', 'deleted')),
  phone text not null default '',
  whatsapp text not null default '',
  address text not null default '',
  affiliation text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  slug text primary key,
  title text not null default '',
  eyebrow text not null default '',
  body text not null default '',
  image_url text not null default '',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.site_content add column if not exists image_url text not null default '';

create table if not exists public.services (
  slug text primary key,
  title text not null,
  summary text not null default '',
  body text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  organization text not null default '',
  service text not null default '',
  quote text not null default '',
  photo_url text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  published_at timestamptz not null default now(),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  eyebrow text not null default '',
  title text not null default '',
  body text not null default '',
  secondary_body text not null default '',
  image_url text not null default '',
  link_label text not null default '',
  link_url text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_slug, section_key)
);

create table if not exists public.site_settings (
  key text primary key,
  label text not null default '',
  value text not null default '',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists category text not null default 'Member';
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists phone text not null default '';
alter table public.profiles add column if not exists whatsapp text not null default '';
alter table public.profiles add column if not exists address text not null default '';
alter table public.profiles add column if not exists affiliation text not null default '';

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and (p.email is null or p.email = '');

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  name text not null,
  father_name text not null default '',
  mother_name text not null default '',
  gender text not null default '',
  date_of_birth date,
  aadhaar_no text not null default '',
  designation text not null default '',
  affiliation text not null default '',
  research_interest text not null default '',
  address text not null default '',
  contact_no text not null default '',
  whatsapp_no text not null default '',
  alternate_email text not null default '',
  highest_qualification text not null default '',
  aadhaar_document_path text not null default '',
  qualification_document_path text not null default '',
  signature_document_path text not null default '',
  photo_document_path text not null default '',
  category text not null default 'Member',
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected', 'revoked', 'deleted')),
  admin_note text not null default '',
  registration_copy text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.membership_applications add column if not exists user_id uuid;
alter table public.membership_applications add column if not exists email text not null default '';
alter table public.membership_applications add column if not exists name text not null default '';
alter table public.membership_applications add column if not exists father_name text not null default '';
alter table public.membership_applications add column if not exists mother_name text not null default '';
alter table public.membership_applications add column if not exists gender text not null default '';
alter table public.membership_applications add column if not exists date_of_birth date;
alter table public.membership_applications add column if not exists aadhaar_no text not null default '';
alter table public.membership_applications add column if not exists designation text not null default '';
alter table public.membership_applications add column if not exists affiliation text not null default '';
alter table public.membership_applications add column if not exists research_interest text not null default '';
alter table public.membership_applications add column if not exists address text not null default '';
alter table public.membership_applications add column if not exists contact_no text not null default '';
alter table public.membership_applications add column if not exists whatsapp_no text not null default '';
alter table public.membership_applications add column if not exists alternate_email text not null default '';
alter table public.membership_applications add column if not exists highest_qualification text not null default '';
alter table public.membership_applications add column if not exists aadhaar_document_path text not null default '';
alter table public.membership_applications add column if not exists qualification_document_path text not null default '';
alter table public.membership_applications add column if not exists signature_document_path text not null default '';
alter table public.membership_applications add column if not exists photo_document_path text not null default '';
alter table public.membership_applications add column if not exists category text not null default 'Member';
alter table public.membership_applications add column if not exists status text not null default 'approved';
alter table public.membership_applications add column if not exists admin_note text not null default '';
alter table public.membership_applications add column if not exists created_at timestamptz not null default now();
alter table public.membership_applications add column if not exists updated_at timestamptz not null default now();

create index if not exists membership_applications_email_idx on public.membership_applications (lower(email));
create index if not exists membership_applications_status_idx on public.membership_applications (status);
alter table public.membership_applications add column if not exists registration_copy text not null default '';

create table if not exists public.membership_application_audit (
  id uuid primary key default gen_random_uuid(),
  application_id uuid,
  event_type text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  before_data jsonb not null default '{}'::jsonb,
  after_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists membership_application_audit_application_idx
  on public.membership_application_audit (application_id, created_at desc);

create or replace function public.audit_membership_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  changed_event text;
begin
  changed_event := case
    when tg_op = 'INSERT' then 'submitted'
    when tg_op = 'DELETE' then 'deleted'
    when old.status is distinct from new.status then 'status_changed'
    else 'updated'
  end;

  insert into public.membership_application_audit (
    application_id, event_type, actor_user_id, before_data, after_data
  )
  values (
    case when tg_op = 'DELETE' then old.id else new.id end,
    changed_event,
    auth.uid(),
    coalesce(to_jsonb(old), '{}'::jsonb),
    coalesce(to_jsonb(new), '{}'::jsonb)
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists membership_application_audit_trigger on public.membership_applications;
create trigger membership_application_audit_trigger
after insert or update or delete on public.membership_applications
for each row execute procedure public.audit_membership_application();

insert into public.membership_application_audit (
  application_id, event_type, before_data, after_data, created_at
)
select a.id, 'baseline', '{}'::jsonb, to_jsonb(a), a.created_at
from public.membership_applications a
where not exists (
  select 1
  from public.membership_application_audit existing
  where existing.application_id = a.id
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where (id = auth.uid() and role = 'admin')
       or lower(coalesce(auth.jwt() ->> 'email', '')) = 'mdsharifmolla354@gmail.com'
  );
$$;

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('membership-documents', 'membership-documents', false)
on conflict (id) do update set public = false;

drop policy if exists "Public can read site media" on storage.objects;
create policy "Public can read site media" on storage.objects for select using (bucket_id = 'site-media');
drop policy if exists "Admins upload site media" on storage.objects;
create policy "Admins upload site media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "Admins update site media" on storage.objects;
create policy "Admins update site media" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_admin()) with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "Admins delete site media" on storage.objects;
create policy "Admins delete site media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "Applicants upload membership documents" on storage.objects;
create policy "Applicants upload membership documents" on storage.objects for insert to anon, authenticated with check (bucket_id = 'membership-documents');
drop policy if exists "Admins read membership documents" on storage.objects;
create policy "Admins read membership documents" on storage.objects for select to authenticated using (bucket_id = 'membership-documents' and public.is_admin());
drop policy if exists "Admins update membership documents" on storage.objects;
create policy "Admins update membership documents" on storage.objects for update to authenticated using (bucket_id = 'membership-documents' and public.is_admin()) with check (bucket_id = 'membership-documents' and public.is_admin());
drop policy if exists "Admins delete membership documents" on storage.objects;
create policy "Admins delete membership documents" on storage.objects for delete to authenticated using (bucket_id = 'membership-documents' and public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, category)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.raw_user_meta_data ->> 'category', 'Member'))
  on conflict (id) do nothing;
  update public.membership_applications
  set user_id = new.id, updated_at = now()
  where user_id is null and lower(email) = lower(new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.claim_membership_application(application_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  update public.membership_applications
  set user_id = auth.uid(), updated_at = now()
  where id = application_id
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and (user_id is null or user_id = auth.uid());

  update public.profiles p
  set email = a.email,
      full_name = a.name,
      category = a.category,
      phone = a.contact_no,
      whatsapp = a.whatsapp_no,
      address = a.address,
      affiliation = a.affiliation,
      updated_at = now()
  from public.membership_applications a
  where a.id = application_id
    and a.user_id = auth.uid()
    and p.id = auth.uid();
end;
$$;

revoke all on function public.claim_membership_application(uuid) from public;
grant execute on function public.claim_membership_application(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.services enable row level security;
alter table public.gallery_items enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.page_sections enable row level security;
alter table public.site_settings enable row level security;
alter table public.membership_applications enable row level security;
alter table public.membership_application_audit enable row level security;

drop policy if exists "Public can read own profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'member');
drop policy if exists "Public can submit membership applications" on public.membership_applications;
create policy "Public can submit membership applications" on public.membership_applications for insert to anon, authenticated with check (true);
drop policy if exists "Users can read own membership applications" on public.membership_applications;
create policy "Users can read own membership applications" on public.membership_applications for select to authenticated using (user_id = auth.uid());
drop policy if exists "Admins manage membership applications" on public.membership_applications;
create policy "Admins manage membership applications" on public.membership_applications for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.membership_application_audit from public, anon, authenticated;
grant select on public.membership_application_audit to authenticated;
drop policy if exists "Admins read membership application audit" on public.membership_application_audit;
create policy "Admins read membership application audit" on public.membership_application_audit
for select to authenticated using (public.is_admin());

-- Public visitors can read active content. Admins can manage all content.
drop policy if exists "Public read active site content" on public.site_content;
create policy "Public read active site content" on public.site_content for select using (active or public.is_admin());
drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content" on public.site_content for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read active services" on public.services;
create policy "Public read active services" on public.services for select using (active or public.is_admin());
drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read active gallery" on public.gallery_items;
create policy "Public read active gallery" on public.gallery_items for select using (active or public.is_admin());
drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Admins manage gallery" on public.gallery_items for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read active reviews" on public.reviews;
create policy "Public read active reviews" on public.reviews for select using (active or public.is_admin());
drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read active notifications" on public.notifications;
create policy "Public read active notifications" on public.notifications for select using (active or public.is_admin());
drop policy if exists "Admins manage notifications" on public.notifications;
create policy "Admins manage notifications" on public.notifications for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read active page sections" on public.page_sections;
create policy "Public read active page sections" on public.page_sections for select using (active or public.is_admin());
drop policy if exists "Admins manage page sections" on public.page_sections;
create policy "Admins manage page sections" on public.page_sections for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read active site settings" on public.site_settings;
create policy "Public read active site settings" on public.site_settings for select using (active or public.is_admin());
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into public.services (slug, title, summary, sort_order)
values
  ('research-journal', 'Research journal', 'Publish your original research in our journal.', 1),
  ('book-publication', 'Book publication', 'Take a manuscript all the way to a printed book.', 2),
  ('conference_workshop', 'Conference & workshop', 'Host or attend academic events and meet your peers.', 3),
  ('faculty_development_programme', 'Faculty development', 'Practical programmes that strengthen teaching.', 4),
  ('research_guidance', 'Research guidance', 'One-to-one mentoring for your research project.', 5),
  ('intelligence_test', 'Intelligence test', 'A structured assessment of cognitive ability.', 6),
  ('merit_scholarship', 'Merit scholarship', 'Support for talented students who cannot pay tuition fees.', 7),
  ('coaching_institute', 'Coaching institute', 'Personal coaching for learners at every level.', 8),
  ('career-counseling', 'Career counselling', 'Clear, tailored guidance for career decisions.', 9),
  ('teachers_bureau', 'Teachers bureau', 'A free service connecting teachers with opportunities.', 10),
  ('mock_test', 'Mock test', 'Practise under exam conditions before the real thing.', 11),
  ('training_placement', 'Training & placement', 'Industry-focused training with placement support.', 12)
on conflict (slug) do nothing;

insert into public.site_content (slug, title, eyebrow, body)
values
  ('home', 'Education should not depend on who can pay for it.', 'A public charitable trust', 'Since 2008, SMSR has supported students, teachers and researchers.'),
  ('about', 'Education is a right worth making accessible.', 'About SMSR', 'Knowledge Review began its journey on 8 August 2008 with the purpose of promoting education at every level.'),
  ('services', 'Services that open a path forward.', 'Our work', 'From publishing research to preparing for a first job, each service is run by the trust and open to learners and educators.'),
  ('notifications', 'Updates from the SMSR community', 'Notifications', 'Important announcements about programmes, registrations, scholarships, workshops and opportunities will appear here.'),
  ('donate', 'Your support can keep a talented student learning.', 'Donate', 'Knowledge Review is a non-profit public charitable trust working to help students who lack the financial support to continue their education.'),
  ('contact', 'We would love to hear from you.', 'Contact', 'Whether you have questions, suggestions or simply want to say hello, reach out to SMSR.'),
  ('terms', 'Terms & conditions', 'SMSR policy', 'Please review the terms that apply to SMSR programmes and services.'),
  ('privacy', 'Privacy policy', 'SMSR policy', 'We respect the information shared by students, educators, members and supporters.'),
  ('refund', 'Refund policy', 'SMSR policy', 'Please review refund expectations before choosing a paid service or making a contribution.')
on conflict (slug) do nothing;

insert into public.notifications (id, title, body, published_at)
values
  ('00000000-0000-0000-0000-000000000001', 'Membership registration', 'Applications are open for students, faculty members, graduates and supporters of education.', now()),
  ('00000000-0000-0000-0000-000000000002', 'Academic opportunities', 'Check this page for new workshops, research guidance, publication and training announcements.', now()),
  ('00000000-0000-0000-0000-000000000003', 'Stay connected', 'For clarification, contact the SMSR office using the details in the footer.', now())
on conflict (id) do nothing;

insert into public.gallery_items (id, title, description, sort_order)
values
  ('00000000-0000-0000-0000-000000000011', 'Research journal', 'Ideas published and shared with a wider academic community.', 1),
  ('00000000-0000-0000-0000-000000000012', 'Conferences & workshops', 'Teachers, researchers and learners meeting to exchange knowledge.', 2),
  ('00000000-0000-0000-0000-000000000013', 'Learning in action', 'Practical guidance that turns curiosity into confident next steps.', 3),
  ('00000000-0000-0000-0000-000000000014', 'Student support', 'Scholarships, coaching and resources that help learners keep moving forward.', 4),
  ('00000000-0000-0000-0000-000000000015', 'Faculty community', 'Educators and professionals sharing experience, research and opportunity.', 5),
  ('00000000-0000-0000-0000-000000000016', 'Training & placement', 'Building practical skills and stronger pathways into professional life.', 6)
on conflict (id) do nothing;

insert into public.reviews (id, name, role, organization, service, quote, photo_url, sort_order)
values
  ('00000000-0000-0000-0000-000000000021', 'Bhaskar Nandi', 'Assistant Professor, Department of Basic Science and Humanities', 'University of Engineering and Management, New Town, Kolkata', 'Journal publication', 'Thanks to Knowledge Review''s journal publication support, my paper reached the right audience. Their streamlined process and expert assistance made publishing fast and hassle-free.', '121.jpg', 1),
  ('00000000-0000-0000-0000-000000000022', 'Dr. Shweta Dwivedi', 'Assistant Professor, Department of Computer Application', 'Integral University, Lucknow', 'Research guidance', 'The personalized research guidance I received was exceptional. The expert mentors provided profound insights and a clear roadmap that elevated the quality of my work.', '122.jpg', 2),
  ('00000000-0000-0000-0000-000000000023', 'Dr. Partha Sen', 'Assistant Professor, Department of Optometry', 'Eminent College of Management and Technology, Barasat', 'Conference', 'The conference hosted by Knowledge Review was a world-class event. It facilitated excellent academic discourse and provided fantastic networking opportunities with international peers.', '123.jpg', 3),
  ('00000000-0000-0000-0000-000000000024', 'Dr. Paula Serdeira Azevedo', 'Associate Professor', 'University of Algarve, Portugal', 'Research guidance', 'The research guidance from Knowledge Review was pivotal for my work. Their mentors offered consistent support and technical expertise.', '1.jpg', 4),
  ('00000000-0000-0000-0000-000000000025', 'Dr. Sunil Kumar Biswas', 'Principal', 'New Barrackpore Prafulla Chandra Mahabidhyalaya, Kolkata', 'Training & placement', 'The training and placement program at Knowledge Review was instrumental in securing my position at TCS. The industry-focused curriculum and dedicated placement support were excellent.', '2.jpg', 5),
  ('00000000-0000-0000-0000-000000000026', 'Jyoti Shaw', 'Management Trainee', 'Tata Consultancy Services, Kolkata', 'Research guidance', 'I am immensely thankful for the research guidance provided by Knowledge Review. The one-on-one mentorship provided clarity and direction that accelerated my research progress.', '3.jpg', 6),
  ('00000000-0000-0000-0000-000000000027', 'Soumen Santra', 'Assistant Professor, Department of MCA', 'Techno International New Town, Kolkata', 'Workshop', 'The workshop organized by Knowledge Review was exceptionally well-managed and intellectually stimulating. It provided a valuable platform for educators to exchange ideas and foster collaborations.', '4.jpg', 7),
  ('00000000-0000-0000-0000-000000000028', 'Dr. Bishnupada Das', 'Secretary', 'Surendralal Das Teachers’ Training College, Howrah', 'Faculty development', 'The Faculty Development program by Knowledge Review was highly effective. It offered practical insights and innovative teaching methodologies that significantly enhanced my skills and classroom engagement.', '5.jpg', 8)
on conflict (id) do nothing;

insert into public.page_sections
  (page_slug, section_key, eyebrow, title, body, secondary_body, link_label, link_url, sort_order)
values
  ('home', 'services-intro', 'The society is engaged to render', 'Services', 'From publishing your research to preparing for your first job, each service is run by the trust and open to learners and educators.', '', '', '', 1),
  ('home', 'hero-primary', '', '', '', '', 'Join as a student', '#/membership', 0),
  ('home', 'hero-secondary', '', '', '', '', 'Explore our services', '#/services', 1),
  ('home', 'join-intro', 'Join the trust', 'Choose how you want to take part', 'Students, academic staff, graduates and supporters can all find a place in the SMSR community.', '', '', '', 1),
  ('home', 'join-student', '', 'Join as a student', 'Find guidance, scholarships, coaching, mock tests and career support built around your next step.', 'Student registration', 'Student registration', 'https://forms.gle/UDkECPGySTJweLL46', 2),
  ('home', 'join-faculty', '', 'Join as a faculty member', 'Contribute your experience through research, teaching, workshops, mentoring and our academic network.', 'Faculty registration', 'Faculty registration', 'https://forms.gle/UDkECPGySTJweLL46', 3),
  ('home', 'gallery-intro', 'Gallery', 'A record of learning in motion', 'Explore the work, gatherings and people that make the SMSR community active.', '', '', '', 1),
  ('home', 'reviews-intro', 'Our community', 'People who have worked with us', 'Educators and professionals from colleges, universities and companies in India and abroad.', '', '', '', 1),
  ('services', 'services-intro', 'Our work', 'Services that open a path forward.', 'From publishing research to preparing for a first job, each service is run by the trust and open to learners and educators.', '', '', '', 1),
  ('gallery', 'gallery-intro', 'Gallery', 'A record of learning in motion', 'Explore the work, gatherings and people that make the SMSR community active.', '', '', '', 1),
  ('reviews', 'reviews-intro', 'Our community', 'People who have worked with us', 'Educators and professionals from colleges, universities and companies in India and abroad.', '', '', '', 1),
  ('about', 'history', '', 'Our history', 'Many talented students were eager to learn but could not afford tuition. We formed a public charitable trust to help those students continue their educational journey.', '', '', '', 1),
  ('about', 'impact', '', '1,700+', 'students reached through our educational work', '', '', '', 2),
  ('about', 'mission', '', 'Mission & vision', 'Our vision is clear: access to quality education should not be limited by caste, creed, age, class, religion or financial circumstance.', 'We support scholarships, mock tests, health check-ups, libraries, books, motivational seminars and the publication of talented scholars’ research.', '', '', 3),
  ('donate', 'cause', '', 'Become part of the cause', 'Your contribution helps us provide scholarships, learning materials, coaching, mock tests, research support and educational opportunities.', 'We have 80G and 12A registration from the Income Tax Department. Donations may be made up to Rs. 2,000 by cash, cheque, DD or online transfer, and above Rs. 2,000 by cheque, DD or online transfer.', '', '', 1),
  ('donate', 'donation-panel', 'UPI ID', 'knowledgereview@icici', '', '', 'Donate online', 'https://forms.gle/yYs39ANV1ou3M1nR8', 2),
  ('donate', 'refund', '', 'Refund policy', 'Refunds are generally not entertained. Please choose any paid service carefully; if SMSR is unable to provide a service, a refund may be considered under appropriate circumstances.', '', '', '', 3),
  ('contact', 'phone', 'Phone number', '+91 8017555556', '', '', '', 'tel:+918017555556', 1),
  ('contact', 'email', 'Email address', 'knowledgereview08@gmail.com', '', '', '', 'mailto:knowledgereview08@gmail.com', 2),
  ('contact', 'address', 'Head office', '8/1/2 Dr. U.N. Brahmachari Street (Loudon Street), Kolkata 700017', '', '', '', '', 3),
  ('terms', 'commitment', '', 'Our commitment', 'We aim to communicate clearly, handle information responsibly and provide educational services with care. Please contact the SMSR office if you need clarification about a policy.', 'These local pages are being prepared from the public information supplied by Knowledge Review and will be updated as the organisation provides final policy wording.', '', '', 1),
  ('privacy', 'commitment', '', 'Our commitment', 'We aim to communicate clearly, handle information responsibly and provide educational services with care. Please contact the SMSR office if you need clarification about a policy.', 'These local pages are being prepared from the public information supplied by Knowledge Review and will be updated as the organisation provides final policy wording.', '', '', 1),
  ('refund', 'commitment', '', 'Our commitment', 'We aim to communicate clearly, handle information responsibly and provide educational services with care. Please contact the SMSR office if you need clarification about a policy.', 'These local pages are being prepared from the public information supplied by Knowledge Review and will be updated as the organisation provides final policy wording.', '', '', 1)
on conflict (page_slug, section_key) do nothing;

insert into public.page_sections
  (page_slug, section_key, title, body, sort_order)
values
  ('research-journal', 'section-1', 'A place for scholarship', 'Our journal service is designed for researchers who want to present focused, original work with a clear academic structure.', 1),
  ('research-journal', 'section-2', 'What we support', 'Manuscript preparation, editorial coordination and a considered route from research idea to publication.', 2),
  ('research-journal', 'section-3', 'Who it is for', 'Students, scholars, faculty members and independent researchers preparing a paper for publication.', 3),
  ('book-publication', 'section-1', 'Textbook publication', 'We support educators and subject experts with editing, formatting and distribution for books intended for classrooms and wider academic use.', 1),
  ('book-publication', 'section-2', 'Edited and author books', 'Articles, novels, memoirs and non-fiction manuscripts can be shaped into a cohesive edited volume or a finished author publication.', 2),
  ('book-publication', 'section-3', 'From manuscript to reader', 'The service supports evaluation, editing, cover design and the practical steps needed to bring a book to life.', 3),
  ('conference_workshop', 'section-1', 'Practical learning', 'Workshops cover technology, business, healthcare, education and more through hands-on sessions, discussions and panels.', 1),
  ('conference_workshop', 'section-2', 'Conferences that connect', 'Conferences bring together academia, industry and government through keynote talks, papers, posters, networking and publications.', 2),
  ('conference_workshop', 'section-3', 'Collaborate with us', 'Students, educators, researchers, institutes, colleges and universities are welcome to collaborate on future events.', 3),
  ('faculty_development_programme', 'section-1', 'Teaching and learning', 'Explore innovative teaching methods, effective assessment and practical ways to improve student engagement.', 1),
  ('faculty_development_programme', 'section-2', 'Research and technology', 'Develop research skills, discover funding opportunities and use learning management, digital content and collaboration tools effectively.', 2),
  ('faculty_development_programme', 'section-3', 'Professional growth', 'Flexible in-person and virtual sessions, mentoring and coaching help faculty members build a confident academic practice.', 3),
  ('research_guidance', 'section-1', 'Find direction', 'Clarify your research question, scope, objectives and the most useful path through the available literature.', 1),
  ('research_guidance', 'section-2', 'Build stronger work', 'Receive practical support with planning, methodology, academic writing, analysis and presentation.', 2),
  ('research_guidance', 'section-3', 'For learners and scholars', 'The service is designed for students, researchers and faculty members who want a clearer, more disciplined research process.', 3),
  ('intelligence_test', 'section-1', 'What the assessment explores', 'The DMIT and brain-fingerprinting material describes multiple intelligence, learning styles, brain dominance, leadership style, thought process and judgement ability.', 1),
  ('intelligence_test', 'section-2', 'Possible outcomes', 'The assessment can support stream selection, detailed career options and extracurricular direction.', 2),
  ('intelligence_test', 'section-3', 'A wider view of ability', 'The service is intended to help families understand a learner’s inborn abilities and preferred channels of learning beyond a single IQ score.', 3),
  ('merit_scholarship', 'section-1', 'Opportunity without the barrier', 'The scholarship service supports bright, motivated learners who need financial assistance to continue their education.', 1),
  ('merit_scholarship', 'section-2', 'What it can enable', 'Support may help students access tuition, learning materials, coaching and the confidence to pursue higher study.', 2),
  ('merit_scholarship', 'section-3', 'A shared responsibility', 'Scholarships are part of SMSR’s wider purpose of making education more affordable and congenial for every learner.', 3),
  ('coaching_institute', 'section-1', 'Courses for different goals', 'The institute supports students at different educational levels, including CBSE, ICSE, WBCHSE, WBJEE, JEE Main and JEE Advanced preparation.', 1),
  ('coaching_institute', 'section-2', 'More than lessons', 'Experienced teachers, study materials, interactive classes and regular assessments create a supportive learning environment.', 2),
  ('coaching_institute', 'section-3', 'Competitive examinations', 'The programme also includes preparation for NET, SET and GATE, alongside life skills such as problem-solving, communication and leadership.', 3),
  ('career-counseling', 'section-1', 'Personalised direction', 'Experienced counsellors help identify strengths, interests and values through assessments and one-to-one sessions.', 1),
  ('career-counseling', 'section-2', 'Practical support', 'The service includes career counselling, educational planning and admission assistance.', 2),
  ('career-counseling', 'section-3', 'A clear next step', 'The aim is to reduce uncertainty and help each learner move toward a fulfilling path with realistic, useful guidance.', 3),
  ('teachers_bureau', 'section-1', 'For educators', 'The bureau is designed to help teachers find relevant opportunities and make their experience more visible to institutions.', 1),
  ('teachers_bureau', 'section-2', 'A stronger academic network', 'It brings educators, colleges and learners into closer contact around teaching, mentoring and development.', 2),
  ('teachers_bureau', 'section-3', 'Keep opportunities moving', 'New openings and announcements can be shared through the SMSR notifications channel.', 3),
  ('mock_test', 'section-1', 'Practice with purpose', 'Mock tests help learners become familiar with timing, question formats and the pressure of completing an examination.', 1),
  ('mock_test', 'section-2', 'Learn from the result', 'Reviewing performance can reveal strengths, gaps and the topics that deserve focused revision.', 2),
  ('mock_test', 'section-3', 'For every stage', 'The service can support school, entrance and competitive exam preparation alongside coaching and research guidance.', 3),
  ('training_placement', 'section-1', 'Industry-focused preparation', 'Training helps learners strengthen the knowledge, communication and workplace habits needed for their first role.', 1),
  ('training_placement', 'section-2', 'From learning to opportunity', 'Placement support connects preparation with possible employers and relevant professional pathways.', 2),
  ('training_placement', 'section-3', 'For emerging professionals', 'The service is designed for students, graduates and learners ready to make a confident transition into work.', 3)
on conflict (page_slug, section_key) do nothing;

insert into public.site_settings (key, label, value)
values
  ('footer_eyebrow', 'Footer eyebrow', 'Contact SMSR'),
  ('footer_title', 'Footer title', 'Let’s build access to learning together.'),
  ('footer_phone', 'Footer phone', '+91 8017555556'),
  ('footer_email', 'Footer email', 'knowledgereview08@gmail.com'),
  ('footer_address', 'Footer address', '8/1/2 Dr. U.N. Brahmachari Street (Loudon Street), Kolkata 700017'),
  ('footer_copyright', 'Footer copyright', 'SMSR · Since 2008')
on conflict (key) do nothing;

-- After creating a Supabase Auth user, promote that user from member to admin:
-- update public.profiles set role = 'admin' where id = 'AUTH_USER_UUID';

-- Additional tables for full admin control
create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_months integer not null default 12,
  price numeric(10,2) not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.membership_applications add column if not exists membership_plan_id uuid references public.membership_plans(id);
alter table public.membership_applications add column if not exists membership_duration_months integer;
alter table public.membership_applications add column if not exists membership_start_date date;
alter table public.membership_applications add column if not exists membership_end_date date;
alter table public.profiles add column if not exists membership_start_date date;
alter table public.profiles add column if not exists membership_end_date date;
alter table public.profiles add column if not exists membership_plan_id uuid references public.membership_plans(id);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  subject text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_type text not null default 'page',
  post_slug text not null default '',
  user_id uuid references auth.users(id) on delete set null,
  name text not null default '',
  email text not null default '',
  message text not null default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists category text default 'Student';
-- allow common categories
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_category_check') then
    alter table public.profiles add constraint profiles_category_check check (category in ('Student','Faculty','Member','Alumni','Associate','Other'));
  end if;
end $$;

alter table public.profiles add column if not exists user_category text;
update public.profiles set user_category = category where user_category is null;

-- RLS for new tables
alter table public.membership_plans enable row level security;
drop policy if exists "Public read active membership plans" on public.membership_plans;
create policy "Public read active membership plans" on public.membership_plans for select using (active or public.is_admin());
drop policy if exists "Admins manage membership plans" on public.membership_plans;
create policy "Admins manage membership plans" on public.membership_plans for all using (public.is_admin()) with check (public.is_admin());

alter table public.feedback enable row level security;
drop policy if exists "Anyone insert feedback" on public.feedback;
create policy "Anyone insert feedback" on public.feedback for insert with check (true);
drop policy if exists "Admins manage feedback" on public.feedback;
create policy "Admins manage feedback" on public.feedback for all using (public.is_admin()) with check (public.is_admin());

alter table public.comments enable row level security;
drop policy if exists "Anyone insert comments" on public.comments;
create policy "Anyone insert comments" on public.comments for insert with check (true);
drop policy if exists "Public read approved comments" on public.comments;
create policy "Public read approved comments" on public.comments for select using (status = 'approved' or public.is_admin());
drop policy if exists "Admins manage comments" on public.comments;
create policy "Admins manage comments" on public.comments for all using (public.is_admin()) with check (public.is_admin());

-- Make mdsharifmolla354@gmail.com super admin (run after user exists)
-- update public.profiles set role = 'admin' where lower(email) = 'mdsharifmolla354@gmail.com';

-- Ensure super admin exists
insert into public.profiles (id, email, full_name, role, category, status)
values ('25bd18aa-1e6c-43be-b294-0e4317ec47ab', 'mdsharifmolla354@gmail.com', 'Md Sharif Molla', 'admin', 'Admin', 'active')
on conflict (id) do update set role = 'admin', status = 'active', category = 'Admin';

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  visible_when_logged_in boolean default true,
  visible_when_logged_out boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.menu_items (label, href, sort_order)
values
  ('Home', '#/home', 0),
  ('About', '#/about', 1),
  ('Services', '#/services', 2),
  ('Notifications', '#/notifications', 3),
  ('Reviews', '#/reviews', 4),
  ('Gallery', '#/gallery', 5),
  ('Donate', '#/donate', 6),
  ('Contact', '#/contact', 7)
on conflict do nothing;

alter table public.menu_items enable row level security;
drop policy if exists "Public read active menu" on public.menu_items;
create policy "Public read active menu" on public.menu_items for select using (active or public.is_admin());
drop policy if exists "Admins manage menu" on public.menu_items;
create policy "Admins manage menu" on public.menu_items for all using (public.is_admin()) with check (public.is_admin());
